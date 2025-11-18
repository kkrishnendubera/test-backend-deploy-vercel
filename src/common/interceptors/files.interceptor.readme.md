# NestJS File Upload Interceptors

### Single File Upload Interceptor

**Usage**

```typescript
import { SingleFileInterceptor } from 'path-to-interceptor';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    @Post('single')
    @UseInterceptors(SingleFileInterceptor('profile', 'avatar'))
    uploadSingle(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.filename, path: file.path };
    }
}
```

#### Features

-   Restricts file size to ****5MB****
-   Stores files in `/public/uploads/{directory}`
-   Filters files by allowed MIME types: `image/jpeg`, `image/png`, `application/pdf`, `text/csv`
-   Validates file extensions: `.jpeg`, `.jpg`, `.png`, `.gif`, `.pdf`

### Multi-File Upload Interceptor
#### Usage

```typescript
import { MultiFileInterceptor } from 'path-to-interceptor';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    @Post('multiple')
    @UseInterceptors(MultiFileInterceptor([
        { name: 'images', directory: 'gallery', maxCount: 5 },
        { name: 'documents', directory: 'docs', maxCount: 3 }
    ]))
    uploadMultiple(@UploadedFiles() files: { images?: Express.Multer.File[], documents?: Express.Multer.File[] }) {
        return files;
    }
}
```

#### Features

-   Supports multiple file fields with different directories
-   Configurable `maxCount` for each field
-   Ensures directory structure is created dynamically
-   Rejects files with unsupported MIME types or extensions

## Security Considerations

-   Ensure only trusted file types are allowed.
-   Validate user permissions before accepting files.
-   Consider additional file optimization using tools like `sharp`.

## References

-   [Multer Documentation](__https://github.com/expressjs/multer__)
-   [NestJS File Upload Guide](__https://docs.nestjs.com/techniques/file-upload__)