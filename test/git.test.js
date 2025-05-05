const child_process = require('child_process');
const tagAndPush = require('../modules/tagAndPush.js');
jest.mock('child_process');

describe('tagAndPush', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('setzt ein neues Tag und pusht es', () => {
		child_process.execSync
			.mockReturnValueOnce('') // git tag list
			.mockImplementationOnce(() => {}) // git tag
			.mockImplementationOnce(() => {}); // git push

		tagAndPush('1.2.3');

		expect(child_process.execSync).toHaveBeenNthCalledWith(1, 'git tag', { encoding: 'utf-8' });
		expect(child_process.execSync).toHaveBeenNthCalledWith(2, 'git add package.json', { stdio: 'inherit' });
		expect(child_process.execSync).toHaveBeenNthCalledWith(3, 'git commit -m "🔖 Release v1.2.3"', { stdio: 'inherit' });
		expect(child_process.execSync).toHaveBeenNthCalledWith(4, 'git tag v1.2.3', { stdio: 'inherit' });
		expect(child_process.execSync).toHaveBeenNthCalledWith(5, 'git push origin v1.2.3', { stdio: 'inherit' });
	});

	it('setzt kein Tag wenn es bereits existiert', () => {
		child_process.execSync.mockReturnValue('v1.2.3\nv1.2.2');

		tagAndPush('1.2.3');

		expect(child_process.execSync).toHaveBeenCalledWith('git tag', { encoding: 'utf-8' });
		expect(child_process.execSync).toHaveBeenCalledTimes(1); // keine weiteren execSync-Aufrufe
	});

	it('gibt eine Warnung bei Fehlern aus', () => {
		child_process.execSync
			.mockReturnValueOnce('') // git tag
			.mockImplementationOnce(() => {
				throw new Error('fail');
			});

		const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		tagAndPush('1.2.3');

		expect(spy).toHaveBeenCalledWith(expect.stringMatching(/Git tagging failed/));
		spy.mockRestore();
	});
});
