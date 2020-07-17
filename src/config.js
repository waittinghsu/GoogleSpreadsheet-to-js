const path = require('path');

module.exports = {
	excelProjectToken: '1GvjTHKmy7BGQdtmruPLitpJs7na7_uYYq-uJ_W5KlT8',
	useApiKey: 'AIzaSyByVmHr93xO1z3kmIQx7EZPH-jO1z0Jw-I',
	template: '',
	distFile: path.resolve(process.cwd(), 'lang.js'), // 檔案輸出至單一檔案 (moduleMode為true時會自動省略)
	distFolder: 'src/i18n/lang', // 檔案輸出資料夾 (moduleMode為true時為必填)
};
