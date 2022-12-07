import * as fs from 'fs';

const maxFolderSize = 100000;
const emptyLine = (l: string) => l.length !== 0;
const noDirectory = (l: string[]) => l[0] !== 'dir';
const entryToFile = (entry: string[]): IFile => {
	return {
		size: Number(entry[0]),
		name: entry[1],
	};
};

interface IFile {
	size: number,
	name: string,
}

interface IFolder {
	parents: string[],
	size: number,
}

interface IFileSystem {
	folders: {
		[folder: string]: IFolder
	},
	pwd: string,
}

const applyInstruction = (fileSytem: IFileSystem, instruction: string[]): IFileSystem => {
	if(instruction[0] === 'cd'){
		const location = instruction[1] === '..' ? 
			fileSytem.folders[fileSytem.pwd].parents[0] : 
			`${fileSytem.pwd}/${instruction[1]}`;
		if(instruction[1] === '/' && fileSytem.pwd === '/')
			return fileSytem;
		
		if(!(location in fileSytem.folders)){
			return {
				folders:{
					...fileSytem.folders,
					[location]: {
						parents: [fileSytem.pwd, ...fileSytem.folders[fileSytem.pwd].parents],
						size: 0
					},
				},
				pwd: location,
			};
		} else {
			return {
				folders:{
					...fileSytem.folders,
				},
				pwd: location,
			};
		}
	} else {
		const files: IFile[] = instruction.slice(1).map(entry => entry.split(' ')).filter(noDirectory).map(entryToFile);
		const totalFileSize = files.reduce((sum, curr) => sum + curr.size, 0);
		const foldersToUpdate = [fileSytem.pwd, ...fileSytem.folders[fileSytem.pwd].parents];
		const newFolderObjects = foldersToUpdate.map((name: string): [string, IFolder]=> [name, {
			...fileSytem.folders[name],
			size: fileSytem.folders[name].size + totalFileSize,
		}]);

		return {
			folders:{
				...fileSytem.folders,
				...Object.fromEntries(newFolderObjects),
			},
			pwd: fileSytem.pwd,
		};
	}
};


const input = fs.readFileSync('inputs/day07.txt', 'utf8').split('$').filter(emptyLine);
const data = input.map(l => l.split('\n').map(l => l.trim()).filter(emptyLine)).map(l => {
	return l[0].split(' ').concat(l.slice(1));
});

const finalFileSystem = data.reduce(applyInstruction, {
	folders: {
		'/': {
			parents: [],
			size: 0,
		},
	},
	pwd: '/',
});

const answer = Object.values(finalFileSystem.folders).reduce((total:number, curr:IFolder):number => {
	return curr.size <= maxFolderSize ? total + curr.size : total;
}, 0);

console.log(answer);
