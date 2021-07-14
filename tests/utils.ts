import path from 'path';

export function getFixturesRootDir(): string {
    return path.join(__dirname, 'fixtures');
}
