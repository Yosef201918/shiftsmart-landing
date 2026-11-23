async (page) => {
  let blockedPosts = 0;
  await page.route('**/*', route => {
    if (route.request().method() === 'POST') { blockedPosts++; return route.abort(); }
    return route.continue();
  });
  await page.reload();
  await page.getByRole('button',{name:'כתבו ביקורת',exact:true}).click();
  await page.getByRole('textbox', {name:'שם',exact:true}).fill('בדיקה מקומית');
  await page.getByRole('textbox', {name:'הביקורת שלכם',exact:true}).fill('\u200b\u200f');
  await page.getByRole('button', {name:'דירוג 4 כוכבים',exact:true}).click();
  await page.getByRole('button', {name:'שליחת ביקורת',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'הזינו שם וביקורת'}).waitFor();
  await page.screenshot({path:'output/form-validation-review.png'});
  await page.getByRole('button', {name:'סגירת חלון הביקורת',exact:true}).click();
  await page.getByRole('dialog',{name:'כתיבת ביקורת',exact:true}).waitFor({state:'hidden'});
  await page.getByRole('button', {name:"הצעת פיצ'ר",exact:true}).click();
  await page.getByRole('textbox', {name:'שם',exact:true}).fill('\u2060');
  await page.getByRole('textbox', {name:'איזה פיצ\'ר תרצו לראות?',exact:true}).fill('תוכן לבדיקת ממשק בלבד');
  await page.getByRole('button', {name:'שליחת הצעה',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'הזינו שם והצעה'}).waitFor();
  await page.setViewportSize({width:375,height:812});
  await page.screenshot({path:'output/form-validation-feature-mobile.png'});
  if (blockedPosts !== 0) throw new Error(`Validation reached network: ${blockedPosts}`);
  console.log('PASS: both forms show validation errors; zero POST attempts; all POST requests intercepted defensively.');
  await page.getByRole('button', {name:"סגירת חלון הצעת הפיצ'ר",exact:true}).click();
  await page.setViewportSize({width:1280,height:720});
}
