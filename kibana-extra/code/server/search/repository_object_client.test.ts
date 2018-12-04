/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AnyObject, EsClient } from '@code/esqueue';
import sinon from 'sinon';

import { CloneWorkerProgress, Repository, WorkerProgress } from '../../model';
import {
  RepositoryDeleteStatusReservedField,
  RepositoryGitStatusReservedField,
  RepositoryIndexName,
  RepositoryIndexNamePrefix,
  RepositoryLspIndexStatusReservedField,
  RepositoryReservedField,
  RepositoryTypeName,
} from '../indexer/schema';
import { RepositoryObjectClient } from './repository_object_client';

const esClient = {
  get: async (_: AnyObject): Promise<any> => {
    Promise.resolve({});
  },
  search: async (_: AnyObject): Promise<any> => {
    Promise.resolve({});
  },
  update: async (_: AnyObject): Promise<any> => {
    Promise.resolve({});
  },
  delete: async (_: AnyObject): Promise<any> => {
    Promise.resolve({});
  },
  index: async (_: AnyObject): Promise<any> => {
    Promise.resolve({});
  },
};
const repoObjectClient = new RepositoryObjectClient((esClient as any) as EsClient);

afterEach(() => {
  sinon.restore();
});

test('CRUD of Repository', async () => {
  const repoUri = 'github.com/elastic/code';

  // Create
  const indexSpy = sinon.spy(esClient, 'index');
  const cObj: Repository = {
    uri: repoUri,
    url: 'https://github.com/elastic/code.git',
    org: 'elastic',
    name: 'code',
  };
  await repoObjectClient.setRepository(repoUri, cObj);
  expect(indexSpy.calledOnce);
  expect(indexSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryReservedField,
      body: JSON.stringify({
        [RepositoryReservedField]: cObj,
      }),
    })
  );

  // Read
  const getFake = sinon.fake.returns({
    _source: {
      [RepositoryReservedField]: cObj,
    },
  });
  esClient.get = getFake;
  await repoObjectClient.getRepository(repoUri);
  expect(getFake.calledOnce);
  expect(getFake.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryReservedField,
    })
  );

  // Update
  const updateSpy = sinon.spy(esClient, 'update');
  const uObj = {
    url: 'https://github.com/elastic/codesearch.git',
  };
  await repoObjectClient.updateRepository(repoUri, uObj);
  expect(updateSpy.calledOnce);
  expect(updateSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryReservedField,
      body: JSON.stringify({
        doc: {
          [RepositoryReservedField]: uObj,
        },
      }),
    })
  );

  // Delete
  const deleteSpy = sinon.spy(esClient, 'delete');
  await repoObjectClient.deleteRepository(repoUri);
  expect(deleteSpy.calledOnce);
  expect(deleteSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryReservedField,
    })
  );
});

test('Get All Repositories', async () => {
  const cObj: Repository = {
    uri: 'github.com/elastic/code',
    url: 'https://github.com/elastic/code.git',
    org: 'elastic',
    name: 'code',
  };
  const searchFake = sinon.fake.returns({
    hits: {
      hits: [
        {
          _source: {
            [RepositoryReservedField]: cObj,
          },
        },
      ],
    },
  });
  esClient.search = searchFake;
  await repoObjectClient.getAllRepositories();
  expect(searchFake.calledOnce);
  expect(searchFake.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: `${RepositoryIndexNamePrefix}*`,
      type: RepositoryTypeName,
    })
  );
});

test('CRUD of Repository Git Status', async () => {
  const repoUri = 'github.com/elastic/code';

  // Create
  const indexSpy = sinon.spy(esClient, 'index');
  const cObj: CloneWorkerProgress = {
    uri: repoUri,
    progress: 100,
    timestamp: new Date(),
  };
  await repoObjectClient.setRepositoryGitStatus(repoUri, cObj);
  expect(indexSpy.calledOnce);
  expect(indexSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryGitStatusReservedField,
      body: JSON.stringify({
        [RepositoryGitStatusReservedField]: cObj,
      }),
    })
  );

  // Read
  const getFake = sinon.fake.returns({
    _source: {
      [RepositoryGitStatusReservedField]: cObj,
    },
  });
  esClient.get = getFake;
  await repoObjectClient.getRepositoryGitStatus(repoUri);
  expect(getFake.calledOnce);
  expect(getFake.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryGitStatusReservedField,
    })
  );

  // Update
  const updateSpy = sinon.spy(esClient, 'update');
  const uObj = {
    progress: 50,
  };
  await repoObjectClient.updateRepositoryGitStatus(repoUri, uObj);
  expect(updateSpy.calledOnce);
  expect(updateSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryGitStatusReservedField,
      body: JSON.stringify({
        doc: {
          [RepositoryGitStatusReservedField]: uObj,
        },
      }),
    })
  );
});

test('CRUD of Repository LSP Index Status', async () => {
  const repoUri = 'github.com/elastic/code';

  // Create
  const indexSpy = sinon.spy(esClient, 'index');
  const cObj: WorkerProgress = {
    uri: repoUri,
    progress: 100,
    timestamp: new Date(),
  };
  await repoObjectClient.setRepositoryLspIndexStatus(repoUri, cObj);
  expect(indexSpy.calledOnce);
  expect(indexSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryLspIndexStatusReservedField,
      body: JSON.stringify({
        [RepositoryLspIndexStatusReservedField]: cObj,
      }),
    })
  );

  // Read
  const getFake = sinon.fake.returns({
    _source: {
      [RepositoryLspIndexStatusReservedField]: cObj,
    },
  });
  esClient.get = getFake;
  await repoObjectClient.getRepositoryLspIndexStatus(repoUri);
  expect(getFake.calledOnce);
  expect(getFake.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryLspIndexStatusReservedField,
    })
  );

  // Update
  const updateSpy = sinon.spy(esClient, 'update');
  const uObj = {
    progress: 50,
  };
  await repoObjectClient.updateRepositoryLspIndexStatus(repoUri, uObj);
  expect(updateSpy.calledOnce);
  expect(updateSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryLspIndexStatusReservedField,
      body: JSON.stringify({
        doc: {
          [RepositoryLspIndexStatusReservedField]: uObj,
        },
      }),
    })
  );
});

test('CRUD of Repository Delete Status', async () => {
  const repoUri = 'github.com/elastic/code';

  // Create
  const indexSpy = sinon.spy(esClient, 'index');
  const cObj: CloneWorkerProgress = {
    uri: repoUri,
    progress: 100,
    timestamp: new Date(),
  };
  await repoObjectClient.setRepositoryDeleteStatus(repoUri, cObj);
  expect(indexSpy.calledOnce);
  expect(indexSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryDeleteStatusReservedField,
      body: JSON.stringify({
        [RepositoryDeleteStatusReservedField]: cObj,
      }),
    })
  );

  // Read
  const getFake = sinon.fake.returns({
    _source: {
      [RepositoryDeleteStatusReservedField]: cObj,
    },
  });
  esClient.get = getFake;
  await repoObjectClient.getRepositoryDeleteStatus(repoUri);
  expect(getFake.calledOnce);
  expect(getFake.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryDeleteStatusReservedField,
    })
  );

  // Update
  const updateSpy = sinon.spy(esClient, 'update');
  const uObj = {
    progress: 50,
  };
  await repoObjectClient.updateRepositoryDeleteStatus(repoUri, uObj);
  expect(updateSpy.calledOnce);
  expect(updateSpy.getCall(0).args[0]).toEqual(
    expect.objectContaining({
      index: RepositoryIndexName(repoUri),
      type: RepositoryTypeName,
      id: RepositoryDeleteStatusReservedField,
      body: JSON.stringify({
        doc: {
          [RepositoryDeleteStatusReservedField]: uObj,
        },
      }),
    })
  );
});
