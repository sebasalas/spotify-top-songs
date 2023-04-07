import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import * as querystring from 'querystring';

@Injectable()
export class SpotifyService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService, private httpService: HttpService) {
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
  }

  async getAccessToken(): Promise<string> {
    const url = 'https://accounts.spotify.com/api/token';
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    };

    const response: AxiosResponse = await this.httpService.post(url, 'grant_type=client_credentials', { headers }).toPromise();
    return response.data.access_token;
  }

  async getTopSongs(accessToken: string): Promise<any> {
    const url = 'https://api.spotify.com/v1/me/top/tracks';
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    const response: AxiosResponse = await this.httpService.get(url, { headers }).toPromise();
    return response.data.items;
  }

  async getAuthorizationUrl(redirectUri: string): Promise<string> {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const queryParams = querystring.stringify({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'user-top-read',
    });

    return `${baseUrl}?${queryParams}`;
  }

  async getAccessTokenFromCode(code: string, redirectUri: string): Promise<string> {
    const url = 'https://accounts.spotify.com/api/token';
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    };
    const data = querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    });

    const response: AxiosResponse = await this.httpService.post(url, data, { headers }).toPromise();
    return response.data.access_token;
  }

}
