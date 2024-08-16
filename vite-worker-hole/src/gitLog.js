import { execSync } from 'child_process';

export default function gitLog({ filePath }) {
	return (tree, file) => {
		try {
			file.data.gitLog = getGitLog(filePath);
		} catch (error) {
			console.error('Failed to retrieve git log:', error);
		}
	};
}

/**
 * Git 로그 정보를 추출하는 함수
 * @param filePath
 * @returns {{date: *, subject: *}[]|*[]}
 */
function getGitLog(filePath) {
	const output = execSync(
		`git log --follow --pretty=format:"%ad, %s" --date=format:"%Y-%m-%dT%H:%M%z" "${filePath}"`
	)
		.toString()
		.trim();

	return (
		output.split('\n').map((line) => {
			const [datetime, comment] = line.split(', ');
			return { datetime, comment };
		}) || []
	);
}
