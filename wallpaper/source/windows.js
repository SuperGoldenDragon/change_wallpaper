import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/windows-wallpaper
// let binary = path.join(__dirname, 'windows-wallpaper-x86-64.exe');

// if(!fs.existsSync(binary)) {
// 	binary = './dist/wallpaper/source/windows-wallpaper-x86-64.exe';
// }
let binary = './dist/wallpaper/source/windows-wallpaper-x86-64.exe';
if(!fs.existsSync(binary)) {
	binary = path.join(__dirname, 'windows-wallpaper-x86-64.exe');
}

export async function getWallpaper() {
	const arguments_ = [
		'get',
	];

	const {stdout} = await execFile(binary, arguments_);
	return stdout.trim();
}

export async function setWallpaper(imagePath, {scale = 'fill'} = {}) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	const arguments_ = [
		'set',
		path.resolve(imagePath),
		'--scale',
		scale,
	];

	await execFile(binary, arguments_);
}
