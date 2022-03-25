import { TSESTree } from "@typescript-eslint/experimental-utils";
import { createRule } from "../utils/createRule";
import ts, { ESMap, ResolvedModuleFull, StringLiteral, SyntaxKind } from "typescript";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { ParserServices } from "@typescript-eslint/experimental-utils";

export = createRule({
    name: "consistent-type-exports",
    meta: {
        type: "suggestion",

        docs: {
            description: "enforces consistent usage of type exports",
            recommended: "error",
        },

        schema: [],

        fixable: undefined,

        messages: {
            typeOverValue:
                "All exports in the declaration are only used as types. Use `exports type`",
        },
    },
    defaultOptions: [],
    create(context) {
        const parserServices = ESLintUtils.getParserServices(context);

        const exportTypeCache: Record<string, string[]> = {};

        return {
            "Program:exit"(programNode: TSESTree.Program): void {
                const ast = parserServices.esTreeNodeToTSNodeMap.get(programNode);
                const sourceFile = ast.getSourceFile() as SourceFile;

                if (
                    !sourceFile ||
                    !sourceFile.resolvedModules ||
                    !sourceFile.resolvedModules.size
                ) {
                    return;
                }

                getModulePath(parserServices, context.getFilename(), exportTypeCache);

                const moduleMap = new ModuleMap(sourceFile.resolvedModules);

                for (const s of sourceFile.statements) {
                    if (
                        [SyntaxKind.ExportDeclaration, SyntaxKind.ExportAssignment].includes(s.kind)
                    ) {
                        const statement = s as ts.ExportDeclaration;

                        if (statement.isTypeOnly) {
                            continue;
                        }

                        if (!statement.exportClause || !statement.moduleSpecifier) {
                            continue;
                        }

                        if (!("elements" in statement.exportClause)) {
                            continue;
                        }

                        const moduleName = (statement.moduleSpecifier as StringLiteral).text;
                        const moduleFullPath = moduleMap.fullPath(moduleName);

                        for (const element of statement.exportClause.elements) {
                            if (
                                exportTypeCache[moduleFullPath].includes(
                                    element.name.escapedText as string,
                                )
                            ) {
                                context.report({
                                    node: programNode,
                                    messageId: "typeOverValue",
                                });
                            }
                        }
                    }
                }
            },
        };
    },
});

const getModulePath = (
    parserServices: ParserServices,
    modulePath: string,
    exportTypeCache: Record<string, any>,
) => {
    const sourceFile = parserServices.program.getSourceFile(modulePath) as SourceFile;

    if (!sourceFile || !sourceFile.resolvedModules) {
        return;
    }

    sourceFile.resolvedModules.forEach(v => {
        if (!v || !v.resolvedFileName) {
            return;
        }

        if (!exportTypeCache[v.resolvedFileName]) {
            exportTypeCache[v.resolvedFileName] = getModuleType(parserServices, v.resolvedFileName);
            getModulePath(parserServices, v.resolvedFileName, exportTypeCache);
        }
    });
};

const getModuleType = (parserServices: ParserServices, modulePath: string) => {
    const sourceFile = parserServices.program.getSourceFile(modulePath) as SourceFile;

    if (!sourceFile) {
        return;
    }

    const result = [];
    const tempType = [];

    for (const statement of sourceFile.statements) {
        // export type A = string;
        // export interface B {}
        if (
            [SyntaxKind.TypeAliasDeclaration, SyntaxKind.InterfaceDeclaration].includes(
                statement.kind,
            )
        ) {
            if (statement.modifiers) {
                if (statement.modifiers[0].kind === SyntaxKind.ExportKeyword) {
                    // @ts-ignore
                    const typeName = statement?.name?.escapedText;

                    if (typeName) {
                        result.push(typeName);
                    }
                }
            }
        }

        {
            // type A = number;
            // export { A };
            if (
                [SyntaxKind.TypeAliasDeclaration, SyntaxKind.InterfaceDeclaration].includes(
                    statement.kind,
                )
            ) {
                if (!statement.modifiers) {
                    // @ts-ignore
                    const typeName = statement?.name?.escapedText;

                    if (typeName) {
                        tempType.push(typeName);
                    }
                }
            }

            if (statement.kind === SyntaxKind.ExportDeclaration) {
                const exportClause = (statement as ts.ExportDeclaration).exportClause;

                if (exportClause) {
                    if ("elements" in exportClause) {
                        for (const element of exportClause.elements) {
                            if (tempType.includes(element.name.escapedText)) {
                                result.push(element.name.escapedText);
                            }
                        }
                    }
                }
            }
        }
    }

    return result;
};

class ModuleMap {
    private readonly map: Record<string, string> = {};

    constructor(private resolvedModules: SourceFile["resolvedModules"]) {
        this.resolvedModules.forEach((v, k) => {
            if (v && v.resolvedFileName) {
                this.map[k] = v.resolvedFileName;
            }
        });
    }

    public fullPath(relativePath: string): string {
        return this.map[relativePath];
    }
}

type SourceFile = ts.SourceFile & {
    resolvedModules: ESMap<string, ResolvedModuleFull>;
};
