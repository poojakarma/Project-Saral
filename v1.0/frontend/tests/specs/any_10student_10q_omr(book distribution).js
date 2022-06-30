const assert = require("assert")
const AppObject = require("./screenObjects/android/appObjectScreen");
const LOGININPUT = require("./screenObjects/android/loginInput")

describe('saral app test', () => {
    beforeEach('test case passed',()=>{
        console.log('test case passed succesfully')
    })
  it('find elements', async () => {
    // schoolId and password
    await driver.pause(5000);
    LOGININPUT.book_distribution();


    await driver.pause(2000);
    const displayLoginButton = await AppObject.loginBtn[1]
    await displayLoginButton.click();


    const displayStartButton = await AppObject.getStartedBtn
    await displayStartButton.waitForDisplayed()
    assert.equal(await displayStartButton.isDisplayed(), true)
    await displayStartButton.click();

    // const openClassDropdown = await AppObject.class_dropdown[0]
    // await openClassDropdown.waitForDisplayed()
    // assert.equal(await openClassDropdown.isDisplayed(), true)
    // await openClassDropdown.click();
     await driver.pause(3000)
    const openClassDropdown = await AppObject.class_dropdown
    await openClassDropdown.click();
   
    
    const class4 = await AppObject.selectClass_4
    await class4.waitForDisplayed()
    assert.equal(await class4.isDisplayed(), true)
    await class4.click();

   await driver.pause(2000)
    const openSubjectDropdown = await AppObject.sectionSubject_dropdown[2]
    await openSubjectDropdown.waitForDisplayed();
    assert.equal(await openSubjectDropdown.isDisplayed(), true)
    await openSubjectDropdown.click();
    await AppObject.selectSubject_2B_Book.click();

    // const subject =  await AppObject.selectSubject_2B_Book
    // await subject.waitForDisplayed();
    // assert.equal(await subject.isDisplayed(), true)
    // await subject.click();


    await AppObject.submitBtn.click();
    await driver.pause(5000);
    await AppObject.nextBtn.click();


    const displaySaveAllBtn = await AppObject.saveAllBtn
    await displaySaveAllBtn.waitForDisplayed();
    assert.equal(await displaySaveAllBtn.isDisplayed(), true)
    await displaySaveAllBtn.click();
    await AppObject.ok.click();

  });


  it('studend deatil and after scan test', async () => {
    await AppObject.continueScanBtn.click();
    await AppObject.submitSetTime;
    await AppObject.scanBtn.click();
    const detailText = await AppObject.studentDetailText
    await detailText.waitForDisplayed({ timeout: 30000 })
    assert.equal(await detailText.isDisplayed(), true)
});

it('page1 validation test', async () => {
    await driver.pause(3000);
    await AppObject.scrollView
    await AppObject.nextBtn.click();
  
});

it('page_2 validation test', async () => {
    await driver.pause(3000);
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.nextBtn.click();
    await AppObject.SUBMIT.click();

});

  it('after scan test cases', async () =>{
    await driver.pause(3000);
    const scanStatusBtn = await AppObject.scanStatus[1]
    await scanStatusBtn.click();
    await driver.pause(3000);
    await driver.back();

    const backBtn = await AppObject.Back
    await backBtn.waitForDisplayed();
    assert.equal(await backBtn.isDisplayed(), true)
    await backBtn.click();

    await driver.pause(3000);
    const saveAllBtn = await AppObject.saveAllBtn
    await saveAllBtn.waitForDisplayed();
    assert.equal(await saveAllBtn.isDisplayed(), true)
    await saveAllBtn.click();

    const saveSuccessInDB = await AppObject.saveSuccessInDB
    await saveSuccessInDB.waitForDisplayed();
    assert.equal(await saveSuccessInDB.isDisplayed(), true)
    await AppObject.ok.click();

    await driver.pause(3000);
    const saveStatusBtn = await AppObject.saveStatus[1]
    await saveStatusBtn.click();
    await driver.pause(3000);
    await driver.back();


    const displayprofileIcon = await AppObject.profileIcon_P
    await displayprofileIcon.waitForDisplayed({ timeout: 5000 });
    assert.equal(await displayprofileIcon.isDisplayed(), true)
    await displayprofileIcon.click();

    await AppObject.logoutTxt.click();
    await AppObject.ok.click();
})

})