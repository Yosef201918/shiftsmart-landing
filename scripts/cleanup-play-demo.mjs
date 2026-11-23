// ביטול תזכורות שנוצרו עבור עבודת הדמו בלבד, בלי נגיעה בהתראות אחרות.
const target=(await(await fetch('http://127.0.0.1:8081/json/list')).json())[0];
if(!target?.webSocketDebuggerUrl)throw new Error('אין חיבור לממשק הפיתוח המקומי');
const expression=`(()=>{try{
 const modules=[...__r.getModules().values()];
 const api=modules.map(m=>m.publicModule?.exports).find(e=>e&&typeof e.getAllScheduledNotificationsAsync==='function'&&typeof e.cancelScheduledNotificationAsync==='function');
 if(!api) return {available:false};
 return api.getAllScheduledNotificationsAsync().then(all=>{
 const isDemo=n=>/Galil|קפה גליל/.test(JSON.stringify(n.content));
 const demo=all.filter(isDemo);
 return Promise.all(${process.argv.includes('--cancel')?'demo.map(n=>api.cancelScheduledNotificationAsync(n.identifier))':'[]'}).then(()=>api.getAllScheduledNotificationsAsync()).then(after=>({available:true,totalBefore:all.length,demoBefore:demo.length,remainingDemo:after.filter(isDemo).length,preservedOther:after.filter(n=>!isDemo(n)).length}));
 });
}catch(error){return {error:String(error.message)}}})()`;
await new Promise((resolve,reject)=>{
 const ws=new WebSocket(target.webSocketDebuggerUrl);
 const timer=setTimeout(()=>{ws.close();reject(new Error('תם זמן בדיקת ההתראות'));},15000);
 ws.onopen=()=>ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:`globalThis.__playDemoCleanupResult={pending:true};Promise.resolve(${expression}).then(r=>globalThis.__playDemoCleanupResult=r,e=>globalThis.__playDemoCleanupResult={error:String(e.message)});`,returnByValue:true}}));
 ws.onmessage=event=>{
  const data=JSON.parse(event.data);if(data.id!==1&&data.id!==2)return;
  if(data.id===1&&!data.result?.exceptionDetails){setTimeout(()=>ws.send(JSON.stringify({id:2,method:'Runtime.evaluate',params:{expression:'JSON.stringify(globalThis.__playDemoCleanupResult)',returnByValue:true}})),1000);return;}
  clearTimeout(timer);ws.close();
  if(data.result?.exceptionDetails){console.log(JSON.stringify({error:data.result.exceptionDetails.text,description:data.result.exceptionDetails.exception?.description?.slice(0,250)}));resolve();return;}
  console.log(JSON.stringify(data.result?.result?.value??data.error));resolve();
 };
 ws.onerror=reject;
});
