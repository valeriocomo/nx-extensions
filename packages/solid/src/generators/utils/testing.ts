import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '../application/application';
import { Tree } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '../library/library';

interface CreateTestProjectParams {
  name: string;
  directory: string;
  type?: 'application' | 'library';
  unitTestrunner?: 'none' | 'jest';
  e2eTestrunner?: 'none' | 'cypress';
}

export async function createTestProject(
  params: CreateTestProjectParams
): Promise<Tree> {
  const {
    name,
    directory,
    type = 'application',
    unitTestrunner = 'none',
    e2eTestrunner = 'none',
  } = params;

  const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  tree.write(
    'package.json',
    `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nx/workspace": "0.0.0"
        }
      }
    `
  );

  if (type === 'application') {
    await applicationGenerator(tree, {
      name,
      directory,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
    });
  }
  if (type === 'library') {
    await libraryGenerator(tree, {
      directory,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      skipFormat: false,
    });
  }

  return tree;
}
