const fs = require('fs');
const path = require('path');
// google-spreadsheet modules 宣告
const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } = require('google-spreadsheet');
const _ = require('lodash');

async function getExcel() {
	// mySheet = new GoogleSpreadsheet('1TffMGlRQ28DBwQLXipJzH4LNFVz2L3-ek_KDpqdjuWE');
	mySheet = new GoogleSpreadsheet('1GvjTHKmy7BGQdtmruPLitpJs7na7_uYYq-uJ_W5KlT8');
	mySheet.useApiKey('AIzaSyByVmHr93xO1z3kmIQx7EZPH-jO1z0Jw-I');
	await mySheet.loadInfo(1); // loads document properties and worksheets
	// console.log('this.sheet.sheetsByIndex[0]._cells', this.sheet.sheetsByIndex[0]);
	// console.log('this.sheet.sheetsByIndex[0]._cells', this.sheet.sheetsByIndex[0]);
	const output = { en: {}, 'zh-CN': {} };
	const columnKey = {}; // A: key, B: zh-CN,C: en, D: EU
	_.each(mySheet.sheetsByIndex, sheet => {
		if (sheet.title === 'BMS') {
			sheet._cells.forEach((rowItem, rowIndex) => {
				if (!rowItem[0].formattedValue) {
					return false;
				}
				if (rowIndex === 0) {
					rowItem.forEach(item => {
						columnKey[item.a1Column] = item.formattedValue;
					});
				} else {
					let keyQ = '';
					rowItem.forEach(item => {
						if (item.a1Column === 'A') {
							keyQ = item.formattedValue;
						}
						if (item.a1Column !== 'A') {
							output[columnKey[item.a1Column]][keyQ] = item.formattedValue;
						}
					});
				}
			});
		}
	});
	return output;
}
getExcel().then(i18ns => {
	_.forEach(i18ns, (fileInfo, fileName) => {
		mkFile(genCode(fileInfo), fileName);
	});
});

function genCode(interfaceList) {
	// console.log(interfaceList);
	let code = '';
	// code = `/* eslint-disable */\n`;
	code += `export default {`;
	_.forEach(interfaceList, (value, key) => {
		code += `  '${key}': \`${value}\`,\n`;
	});
	code += `};\n`;
	return code;
}

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
	const sep = path.sep;

	const initDir = path.isAbsolute(targetDir) ? sep : '';

	const baseDir = isRelativeToScript ? __dirname : '.';

	targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);

		try {
			fs.mkdirSync(curDir);

			console.log(`Directory ${curDir} created!`);
		} catch (err) {
			if (err.code !== 'EEXIST') {
				throw err;
			}

			console.log(`Directory ${curDir} already exists!`);
		}

		return curDir;
	}, initDir);
}

function mkFile(info, fileName) {
	deleteDir('src/i18n/lang');
	mkDirByPathSync('src/i18n/lang');
	fs.writeFile(`src/i18n/lang/${fileName}.js`, info, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log(`Write operation complete.  ${fileName}.js`);
		}
	});
}

function deleteDir(url) {
	let files = [];

	if (fs.existsSync(url)) {
		// 判定給定路徑是否存在

		files = fs.readdirSync(url); // 返回文件和子目錄的陣列
		files.forEach((file, index) => {
			const curPath = path.join(url, file);

			if (fs.statSync(curPath).isDirectory()) {
				// 同步讀取資料夾內資料，如果為資料夾，則回調自身
				deleteDir(curPath);
			} else {
				fs.unlinkSync(curPath); // 是指定文件則刪除
			}
		});

		fs.rmdirSync(url); // 資料夾
	}
}
