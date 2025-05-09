import { createReadStream, createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ArchivoService {
  /*
  private obtenerArchivo(nombreArchivo, nombreCarpeta): ReadStream {
    const ruta = join(__dirname, '..', '..', '..', 'archivos', nombreCarpeta, nombreArchivo);
    const stream = createReadStream(ruta);
    this.borrarArchivo(stream, ruta);
    return stream;
  }
  */
  guardarArchivo(nombreArchivo, nombreCarpeta, buffer) {
    try {
      const rutaCarpeta = this.crearCarpeta(nombreCarpeta);
      const rutaArchivo = join(rutaCarpeta, nombreArchivo);
      const writeStream = createWriteStream(rutaArchivo);
      writeStream.write(buffer);
      writeStream.end();
      const readStream = createReadStream(rutaArchivo);
      this.borrarArchivo(readStream, rutaArchivo);
      return { success: true, archivo: readStream };
    } catch (err) {
      return { success: false, err };
    }
  }

  private crearCarpeta(nombreCarpeta) {
    const rutaCarpetaArchivos = join(__dirname, '..', '..', '..', 'archivos');
    const rutaCarpetaACrear = join(rutaCarpetaArchivos, nombreCarpeta);

    try {
      if (!existsSync(rutaCarpetaArchivos)) {
        mkdirSync(rutaCarpetaArchivos);
      }
    } catch (err) {
      console.error('Error al crear la carpeta archivos ', err);
    }
    try {
      if (!existsSync(rutaCarpetaACrear)) {
        mkdirSync(rutaCarpetaACrear);
      }
    } catch (err) {
      console.error('Error al crear la carpeta consultas ', err);
    }
    return rutaCarpetaACrear;
  }

  private borrarArchivo(stream, ruta) {
    stream.on('close', () => {
      unlink(ruta, (err) => {
        if (err) {
          console.error('Error al borrar el archivo:', err);
        } else {
          console.log('Archivo borrado:', ruta);
        }
      });
    });
  }
}
