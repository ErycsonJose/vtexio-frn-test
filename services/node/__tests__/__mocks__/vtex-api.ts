export class JanusClient {
  protected http: any

  constructor(_ctx: any, _options?: any) {
    this.http = {
      get: jest.fn(),
    }
  }
}

export class IOClients {}
export class LRUCache {
  constructor(_options: any) {}
}
