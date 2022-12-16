export function IsEmailAddress(emailAddress: string ): boolean {
    let iAt: number = emailAddress.indexOf("@");
    let iDot: number = emailAddress.lastIndexOf(".");
    return (iAt > 0 && iDot > iAt);
}