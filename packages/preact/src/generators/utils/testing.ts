import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '../application/application';
import { ProjectType, Tree } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '../library/library';

interface CreateTestProjectParams {
  name: string;
  directory: string;
  type?: ProjectType;
  unitTestRunner?: 'none' | 'jest';
  e2eTestRunner?: 'none' | 'cypress';
}

export async function createTestProject(
  params: CreateTestProjectParams
): Promise<Tree> {
  const {
    name,
    directory,
    unitTestRunner = 'none',
    e2eTestRunner = 'none',
    type = 'application',
  } = params;
  const host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

  if (type === 'application') {
    await applicationGenerator(host, {
      name,
      directory,
      linter: Linter.EsLint,
      unitTestRunner,
      e2eTestRunner,
    });
  }
  if (type === 'library') {
    await libraryGenerator(host, {
      name,
      directory,
      linter: Linter.EsLint,
      unitTestRunner,
      e2eTestRunner,
      skipFormat: false,
    });
  }

  return host;
}
