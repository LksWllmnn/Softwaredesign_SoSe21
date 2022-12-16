import { IsEmailAddress } from "../src/classes/EmailAdress";
import { testAccountName } from "../src/classes/testFile";


describe("This is a simple test", () => {
    test("Check the Mailaddress function", () => {
        console.log("test");
        expect(IsEmailAddress("ich@provider.com")).toBe(true);
    });
});


describe("This is the second simple test", () => {
    test("RegEx test function of User", () => {
        console.log("test");
        expect(testAccountName("testName")).toBe(true);
    });
});