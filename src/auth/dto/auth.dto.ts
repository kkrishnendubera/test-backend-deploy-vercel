import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshJwtDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Access token to reach private urls" })
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Token to refresh whole pair" })
  refreshToken: string;
}

