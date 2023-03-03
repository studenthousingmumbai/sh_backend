"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = {
    getCurrentDirectoryBase: () => {
        return path_1.default.basename(process.cwd());
    },
    directoryExists: (filePath) => {
        return fs_1.default.existsSync(filePath);
    },
    list_files: (dir_path) => {
        try {
            let file_names = fs_1.default.readdirSync(dir_path);
            return file_names;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    create_directory: (dir_path) => {
        try {
            fs_1.default.mkdirSync(dir_path);
        }
        catch (err) {
            console.log(err);
        }
    },
    delete_directory: (dir_path) => {
        try {
            fs_1.default.rmdirSync(dir_path, { recursive: true });
        }
        catch (err) {
            console.log(err);
        }
    },
    readFile: (file_path) => {
        return fs_1.default.readFileSync(file_path, { encoding: 'utf8' });
    },
    writeFile: (file_path, content = "") => {
        try {
            fs_1.default.writeFileSync(file_path, content);
        }
        catch (err) {
            console.log(err);
        }
    },
    deleteFile: (path) => {
        try {
            fs_1.default.unlinkSync(path);
        }
        catch (err) {
            console.error(err);
        }
    },
};
