import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller()
export class AuthenticationController {
  @Post('/login')
  async login(@Body() payload: { token: string }) {
    const ticket = await client.verifyIdToken({
      idToken: payload.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // log the ticket payload in the console to see what we have
    console.log(ticket.getPayload());
  }
}
