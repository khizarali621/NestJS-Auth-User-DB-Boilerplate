import { Module, forwardRef } from '@nestjs/common';
import { MongoModule } from './mongo.module';
import { DatabaseModule } from './database.module';

@Module({
    imports: [
        MongoModule,
        DatabaseModule,
    ],
    exports: [
        MongoModule,
        DatabaseModule,
    ]
})
export class CommonModule {}
