import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [HttpModule],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
