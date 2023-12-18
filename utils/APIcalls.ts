import { expect } from '@playwright/test';

export class APIcalls {
  private readonly apiEndpoint: string;

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }

  async login(username: string, password: string): Promise<string> {
    const requestBody = { username, password };

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(200);

    const jsonResponse = await response.json();
    expect(jsonResponse).toBeDefined();
    expect(jsonResponse).toHaveProperty('token');

    const token = jsonResponse.token;
    console.log('Token:', token);

    return token;
  }
}