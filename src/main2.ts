import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;
  
  try {
    await CommandFactory.run(AppModule);
    console.log('Success!');
    process.exit()
  } catch (e) {
    console.log(e.message);
    process.exit()
  }
}

bootstrap();