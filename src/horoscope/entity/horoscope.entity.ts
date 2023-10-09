import { ApiProperty } from "@nestjs/swagger";

export class Horoscope {

    @ApiProperty({
        description: "Name in spanish of zodiac sign request, in lowercase",
        example: "aries",
        required: true
    })
    name: string;

    @ApiProperty({
        example:'Todo irá bien',
        description: 'Daily prediction of this zodiac dign',
        default: null
    })
    daily?: string;

    @ApiProperty({
        example: '08/06/2023, 11:49:13',
        description: 'TimeStamp date of last updating daily prediction',
        default: null
    })
    lastUpdatedDaily?: Date;

    @ApiProperty({
        example:'Te tocará la lotería',
        description: 'Weekly prediction of this zodiac dign',
        default: null
    })
    weekly?: string;

    @ApiProperty({
        example: '08/06/2023, 11:49:13',
        description: 'TimeStamp date of last updating weekly prediction',
        default: null
    })
    lastUpdatedWeekly?: Date;
}