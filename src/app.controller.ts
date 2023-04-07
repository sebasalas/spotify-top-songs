import { Controller, Get, Req, Res, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SpotifyService } from './spotify/spotify.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly spotifyService: SpotifyService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('top-songs')
  async getTopSongs(@Req() request: Request): Promise<any> {
    const accessToken = request.cookies['spotify_access_token'];
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const topSongs = await this.spotifyService.getTopSongs(accessToken);
    return topSongs;
  }

  @Get('auth')
  async authenticate(@Req() request, @Res() response): Promise<void> {
    const redirectUri = `${request.protocol}://${request.get('host')}/callback`;
    const authorizationUrl = await this.spotifyService.getAuthorizationUrl(redirectUri);
    response.redirect(authorizationUrl);
  }

  // Add this method within the AppController class
  @Get('callback')
  async callback(@Query('code') code: string, @Req() request, @Res() response): Promise<void> {
    const redirectUri = `${request.protocol}://${request.get('host')}/callback`;
    const accessToken = await this.spotifyService.getAccessTokenFromCode(code, redirectUri);

    // Store the access token in a cookie or session
    response.cookie('spotify_access_token', accessToken);
    response.redirect('/top-songs');
  }

}
