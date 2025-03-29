import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '../application/application';
import { Tree, ProjectType } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '../library/library';

interface CreateTestProjectParams {
  name: string;
  directory: string;
  type?: ProjectType;
  tree?: Tree;
  unitTestrunner?: 'none' | 'jest';
  e2eTestrunner?: 'none' | 'cypress';
}

export async function createTestProject(
  params: CreateTestProjectParams
): Promise<Tree> {
  // directory: string,
  // type: ProjectType = 'application',
  // tree: Tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' }),
  // unitTestrunner: 'none' | 'jest' = 'none',
  // e2eTestrunner: 'none' | 'cypress' = 'none'
  const {
    name,
    directory,
    type = 'application',
    unitTestrunner = 'none',
    e2eTestrunner = 'none',
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' }),
  } = params;
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
      name,
      directory,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      buildable: true,
      skipFormat: false,
    });
  }

  return tree;
}
