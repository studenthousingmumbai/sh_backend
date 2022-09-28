import fs from 'fs';
import path from 'path';

export default {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },

    directoryExists: (filePath: string) => {
        return fs.existsSync(filePath);
    },

    list_files: (dir_path: string) => {
        try {
            let file_names = fs.readdirSync(dir_path);
            return file_names;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },

    create_directory: (dir_path: string) => {
        try {
            fs.mkdirSync(dir_path);
        }
        catch (err) {
            console.log(err);
        }
    },

    delete_directory: (dir_path: string) => {
        try {
            fs.rmdirSync(dir_path, { recursive: true });
        }
        catch (err) {
            console.log(err);
        }
    },

    readFile: (file_path: string) => {
        return fs.readFileSync(file_path, { encoding: 'utf8' });
    },

    writeFile: (file_path: string, content = "") => {
        try {
            fs.writeFileSync(file_path, content);
        }
        catch (err) {
            console.log(err);
        }
    },

    deleteFile: (path: string) => {
        try {
            fs.unlinkSync(path)
        } catch (err) {
            console.error(err)
        }
    },
};