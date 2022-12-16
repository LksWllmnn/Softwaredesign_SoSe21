export function testAccountName(_name: string): boolean {
    let contRegEx: RegExp = new RegExp(/^[a-zA-Z0-9]\w{3,11}$/);
    return contRegEx.test(_name);
}