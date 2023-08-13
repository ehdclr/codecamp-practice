import { FileUpload } from 'graphql-upload';
import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

interface IFilesServiceUpload {
  files: FileUpload[];
}

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    const waitedFiles = [];
    waitedFiles[0] = await files[0];
    waitedFiles[1] = await files[1];

    console.log(waitedFiles);

    //1-1) 스토리지 셋팅하기

    const storage = new Storage({
      projectId: 'linear-analyst-310412',
      keyFilename: 'gcp-file-storage.json',
    }).bucket('jong2-storage-codecamp');

    //1-2) 스토리지에 파일 올리기
    const result = await new Promise((resolve, reject) => {
      waitedFiles.map((el) => {
        el.createReadStream()
          .pipe(storage.file(el.filename).createWriteStream())
          .on('finish', () => resolve('성공'))
          .on('error', () => reject('실패'));
      });
    });
    console.log(result);

    console.log('파일 전송이 완료되었습니다.');

    return ['끝', '끝'];
  }
}
