const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=n=>Math.round(n).toLocaleString("zh-CN");
const state={use:"gaming",detail:"3A 大作",scope:"tower",mode:"mixed",cpuBrand:"auto",gpuBrand:"auto",variant:0};
const sceneChoices={
 gaming:{title:"游戏开黑",desc:"先选你最常玩的游戏类型",items:[["高帧电竞","CS2 / 无畏契约 / LOL","1080","pro"],["热门网游","永劫无间 / PUBG / 魔兽","1440","balanced"],["3A 大作","黑神话 / 赛博朋克 / 荒野大镖客","1440","pro"],["4K 单机","4K 高画质 / 光追游戏","2160","pro"],["模拟经营","城市天际线 / 模拟飞行","1440","balanced"],["多开搬砖","多开网游 / 模拟器","1080","pro"]]},
 office:{title:"办公学习",desc:"选择主要工作和学习方式",items:[["日常文档","Office / 网页 / 邮件","1080","light"],["网课学习","视频会议 / 在线课堂","1080","balanced"],["编程开发","VS Code / Docker / 多任务","1440","pro"],["财务办公","Excel 大表 / ERP / 多屏","1440","balanced"],["移动办公","小机箱 / 低功耗 / 安静","1080","light"],["综合办公","办公、影音和轻度游戏","1440","balanced"]]},
 design:{title:"设计剪辑",desc:"选择你最常使用的创作软件",items:[["平面设计","Photoshop / Illustrator","1440","balanced"],["视频剪辑","Premiere / 剪映专业版","1440","pro"],["特效包装","After Effects / 达芬奇","2160","pro"],["摄影修图","Lightroom / 大批量 RAW","1440","pro"],["UI 设计","Figma / 即时设计 / PS","1440","balanced"],["4K 创作","4K 多轨剪辑与调色","2160","pro"]]},
 stream:{title:"直播开播",desc:"选择直播内容和使用方式",items:[["游戏直播","游戏 + OBS 同机推流","1440","pro"],["带货直播","多平台推流 / 直播伴侣","1080","balanced"],["虚拟主播","Live2D / 动捕 / OBS","1440","pro"],["赛事导播","多路画面 / 采集卡","1440","pro"]]},
 ai:{title:"AI 本地部署",desc:"显存容量会直接影响可运行的模型",items:[["AI 绘图","Stable Diffusion / ComfyUI","1440","pro"],["本地大模型","7B–32B LLM 推理","1440","pro"],["AI 视频","图生视频 / 视频生成","2160","pro"],["开发训练","CUDA / PyTorch / 微调","1440","pro"]]},
 cad:{title:"3D / CAD",desc:"选择你的生产力软件和项目规模",items:[["机械 CAD","SolidWorks / AutoCAD","1440","pro"],["建筑设计","Revit / SketchUp / BIM","1440","pro"],["三维建模","Blender / C4D / Maya","1440","pro"],["离线渲染","V-Ray / Corona / Blender","2160","pro"]]}
};
const profiles={
 gaming:{title:"游戏电竞",tag:"高帧游戏",gpu:.39,cpu:.19,power:450},
 office:{title:"办公学习",tag:"安静高效",gpu:.12,cpu:.25,power:220},
 design:{title:"设计剪辑",tag:"创作加速",gpu:.31,cpu:.25,power:420},
 ai:{title:"AI 本地部署",tag:"大显存算力",gpu:.45,cpu:.18,power:560},
 stream:{title:"直播推流",tag:"游戏直播双兼顾",gpu:.34,cpu:.24,power:460},
 cad:{title:"3D / CAD",tag:"建模渲染",gpu:.34,cpu:.26,power:480}
};
const pools={
 cpu:{amd:["AMD 锐龙 5 7500F","AMD 锐龙 7 7700","AMD 锐龙 7 7800X3D","AMD 锐龙 9 9950X"],intel:["Intel 酷睿 i5-14400F","Intel 酷睿 Ultra 5 245K","Intel 酷睿 i7-14700K","Intel 酷睿 Ultra 9 285K"]},
 gpu:{nvidia:["RTX 4060 8GB","RTX 5060 Ti 16GB","RTX 5070 12GB","RTX 5080 16GB","RTX 5090 32GB"],amd:["RX 7600 8GB","RX 7800 XT 16GB","RX 9070 XT 16GB","RX 7900 XTX 24GB"]},
 board:{amd:["华硕 TUF B650M-PLUS WIFI","微星 B650M MORTAR WIFI","技嘉 X870 AORUS ELITE WIFI7"],intel:["华硕 TUF B760M-PLUS WIFI","微星 Z890 GAMING PLUS WIFI","技嘉 Z890 AORUS ELITE WIFI7"]}
};
function tier(b){return b<5200?0:b<8500?1:b<14000?2:b<25000?3:4}
function pick(a,n){return a[Math.min(a.length-1,Math.max(0,n))]}
function segment(id,key){$$(`#${id} button`).forEach(b=>b.onclick=()=>{$$(`#${id} button`).forEach(x=>x.classList.remove("active"));b.classList.add("active");state[key]=b.dataset.value;generate()})}
segment("scope","scope");segment("mode","mode");segment("cpuBrand","cpuBrand");segment("gpuBrand","gpuBrand");
let pendingChoice=null;
function openChoice(use){
 state.use=use;pendingChoice=null;const config=sceneChoices[use],sheet=$("#choiceSheet");
 $("#choiceTitle").textContent=config.title;$("#choiceDesc").textContent=config.desc;
 $("#choiceList").innerHTML=config.items.map((item,i)=>`<button type="button" data-choice="${i}"><span><strong>${item[0]}</strong><small>${item[1]}</small></span><i>›</i></button>`).join("");
 $("#choiceSummary").textContent="请选择一个具体场景";$("#confirmChoice").disabled=true;
 sheet.classList.add("show");sheet.setAttribute("aria-hidden","false");document.body.classList.add("sheet-open");
 $$("#choiceList button").forEach(b=>b.onclick=()=>{$$("#choiceList button").forEach(x=>x.classList.remove("active"));b.classList.add("active");pendingChoice=config.items[+b.dataset.choice];$("#choiceSummary").textContent=`已选：${pendingChoice[0]} · ${pendingChoice[1]}`;$("#confirmChoice").disabled=false});
}
function closeChoice(){$("#choiceSheet").classList.remove("show");$("#choiceSheet").setAttribute("aria-hidden","true");document.body.classList.remove("sheet-open")}
$$(".scene").forEach(b=>b.onclick=()=>openChoice(b.dataset.value));
$("#closeSheet").onclick=closeChoice;$("#choiceSheet").onclick=e=>{if(e.target===$("#choiceSheet"))closeChoice()};
$("#confirmChoice").onclick=()=>{if(!pendingChoice)return;state.detail=pendingChoice[0];$("#resolution").value=pendingChoice[2];$("#intensity").value=pendingChoice[3];$$(".scene").forEach(x=>x.classList.toggle("active",x.dataset.value===state.use));const chosen=$(`.scene[data-value="${state.use}"] small`);if(chosen)chosen.textContent=pendingChoice[0];closeChoice();generate();$("#result").scrollIntoView({behavior:"smooth",block:"start"})};
const budget=$("#budget");budget.oninput=()=>{$("#budgetText").textContent=money(budget.value);$$("[data-budget]").forEach(b=>b.classList.toggle("active",+b.dataset.budget===+budget.value));generate()};
$$("[data-budget]").forEach(b=>b.onclick=()=>{budget.value=b.dataset.budget;budget.dispatchEvent(new Event("input"))});
$("#usedLevel").oninput=e=>{$("#usedText").textContent=["保守 · 只买低风险配件","适中 · 显卡/CPU 可考虑","激进 · 优先追求性能"][e.target.value];generate()};
$$("select,.checks input").forEach(x=>x.onchange=generate);
function generate(){
 const totalBudget=+budget.value,p=profiles[state.use],scopeRate={tower:1,monitor:.84,full:.77}[state.scope],target=totalBudget*scopeRate;
 const t=tier(target),res=+$("#resolution").value,intensity=$("#intensity").value,years=+$("#years").value;
 let cpuPlatform=state.cpuBrand==="auto"?(state.use==="office"&&t<2?"intel":"amd"):state.cpuBrand;
 let gpuPlatform=state.gpuBrand==="auto"?(state.use==="gaming"&&t<2?"amd":"nvidia"):state.gpuBrand;
 if(state.use==="ai"||state.use==="design"||state.use==="stream")gpuPlatform=state.gpuBrand==="amd"?"amd":"nvidia";
 const noGpu=gpuPlatform==="igpu",gpuTier=Math.max(0,t+(res===2160?1:0)+(intensity==="pro"?1:0)-1+state.variant%2);
 const cpuTier=Math.max(0,t+(intensity==="pro"?1:0)-1+(state.variant+1)%2);
 let mem=$("#memory").value==="auto"?(["design","ai","cad"].includes(state.use)?64:t>2?64:32):+$("#memory").value;
 let storage=$("#storage").value==="auto"?(t>2?2:1):+$("#storage").value;
 const used=state.mode==="new"?0:state.mode==="used"?2:+$("#usedLevel").value;
 const condition=(type)=>used===0?"全新":used===2&&!["电源","硬盘"].includes(type)?"二手建议":"全新建议";
 const ratios=[p.cpu,noGpu?.01:p.gpu,.08,.08,.09,.065,.055,.045],sum=ratios.reduce((a,b)=>a+b,0);
 const price=i=>Math.round(target*(ratios[i]/sum)/10)*10;
 const cpu=pick(pools.cpu[cpuPlatform],cpuTier);
 const gpu=noGpu?"CPU 核芯显卡":pick(pools.gpu[gpuPlatform],gpuTier);
 const size=$("#size").value,quiet=$("#quiet").checked,rgb=$("#rgb").checked,wifi=$("#wifi").checked,upgrade=$("#upgrade").checked;
 const names=[cpu,gpu,`${mem}GB DDR5 6000 双通道`,`${storage}TB PCIe 4.0 NVMe SSD`,pick(pools.board[cpuPlatform],t>2?2:t>0?1:0)+(wifi?"":" 无线版可取消"),upgrade?(p.power>500?"1000W ATX 3.1 金牌全模组":"850W ATX 3.1 金牌全模组"):(p.power>500?"850W 金牌全模组":"650W 金牌全模组"),rgb?"全景侧透海景房机箱":size==="mini"?"ITX 迷你机箱":size==="compact"?"M-ATX 紧凑机箱":"高风道 ATX 机箱",quiet?"双塔静音风冷 + 低噪风扇":cpuTier>2?"360mm 一体式水冷":"双塔六热管风冷"];
 const types=["CPU","显卡","内存","硬盘","主板","电源","机箱","散热"];
 const notes=["核心运算","图形与算力","多任务","系统与素材","扩展平台","稳定供电","风道与外观","温度控制"];
 window.parts=names.map((name,i)=>({type:types[i],name,note:notes[i],price:price(i),condition:condition(types[i])}));
 const extras=[];
 if(state.scope!=="tower")extras.push({type:"显示器",name:res===2160?"27英寸 4K 160Hz":res===1440?"27英寸 2K 180Hz":"24.5英寸 1080P 240Hz",note:"匹配目标画质",price:Math.round(totalBudget*(state.scope==="monitor"?.16:.14)/10)*10,condition:"全新建议"});
 if(state.scope==="full")extras.push({type:"键鼠音频",name:"机械键盘 + 电竞鼠标 + 头戴耳机",note:"整套外设",price:Math.round(totalBudget*.09/10)*10,condition:"全新建议"});
 window.parts.push(...extras);
 const total=window.parts.reduce((s,x)=>s+x.price,0),power=Math.round(p.power*(noGpu?.48:1)*(1+t*.03)),psu=upgrade?(power>500?1000:850):(power>500?850:650);
 const newRate=used===0?100:used===1?72:46,score=Math.max(81,97-(res===2160&&t<2?7:0)-(state.gpuBrand==="igpu"&&state.use==="gaming"?10:0)+(upgrade?2:0));
 $("#resultTitle").textContent=`${state.detail} · ${p.title}${intensity==="pro"?"专业":intensity==="light"?"轻量":"均衡"}配置`;
 $("#resultTag").textContent=`${p.tag} · ${res===2160?"4K":res===1440?"2K":"1080P"} · ${state.mode==="new"?"全新":state.mode==="used"?"二手优先":"新旧混搭"}`;
 $("#score").textContent=score;$("#power").textContent=power+"W";$("#headroom").textContent=Math.round((1-power/psu)*100)+"%";$("#newRate").textContent=newRate+"%";$("#cycle").textContent=years+" 年";
 $("#partCount").textContent=window.parts.length+" 项";$("#compatText").textContent=`${cpuPlatform.toUpperCase()} 平台 · ${psu}W 电源 · 尺寸与接口匹配`;
 $("#parts").innerHTML=window.parts.map((x,i)=>`<div class="part"><span>${String(i+1).padStart(2,"0")}</span><div><small>${x.type} · ${x.note}</small><strong>${x.name}</strong><em>${x.condition}</em></div><aside><small>参考估价</small><b>¥${money(x.price)}</b><button class="swap" data-swap="${i}">替换</button></aside></div>`).join("");
 $$(".swap").forEach(b=>b.onclick=()=>{state.variant++;generate()});
 $("#total").textContent=money(total);$("#budgetDiff").textContent=`预算利用率 ${Math.round(total/totalBudget*100)}%`;
 $("#chartBars").innerHTML=window.parts.slice(0,6).map(x=>`<div class="bar"><span>${x.type}</span><i style="--w:${Math.min(100,x.price/totalBudget*240)}%"></i><b>${Math.round(x.price/totalBudget*100)}%</b></div>`).join("");
 const advice=[res===2160&&t<2?"当前预算挑战 4K 游戏较吃力，建议改选 2K 或提高预算。":`配置重点向${p.gpu>p.cpu?"显卡":"处理器"}倾斜，符合“${p.title}”需求。`,upgrade?`电源和主板保留了约 ${Math.round((1-power/psu)*100)}% 余量，方便后期升级。`:"为控制预算压缩了升级余量，未来换显卡可能需要同时更换电源。",used?`二手方案建议重点核验显卡压力测试、维修记录和剩余保修；硬盘、电源优先买新。`:"全新方案售后更稳，建议优先选择自营或品牌旗舰店。",mem>=64?`${mem}GB 内存适合大型工程和多任务，但纯游戏用户可降至 32GB。`:"32GB 双通道能满足主流游戏与日常创作。"];
 $("#advice").innerHTML=advice.map(x=>`<li>${x}</li>`).join("");
}
$("#generate").onclick=()=>{generate();$("#result").scrollIntoView({behavior:"smooth",block:"start"})};
$("#regenerate").onclick=()=>{state.variant++;generate()};
$("#copy").onclick=async()=>{const text=[`瓜瓜装机｜${$("#resultTitle").textContent}`,`预算：¥${money(budget.value)}｜${$("#resultTag").textContent}`,...window.parts.map(x=>`${x.type}：${x.name}（${x.condition}，约 ¥${money(x.price)}）`),`参考总价：¥${$("#total").textContent}`,`预计功耗：${$("#power").textContent}｜电源余量：${$("#headroom").textContent}`].join("\n");try{await navigator.clipboard.writeText(text)}catch(e){}$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1600)};
const proCard=$("#settings"),proToggle=$("#proToggle");
function openSettings(){proCard.classList.add("open");proCard.scrollIntoView({behavior:"smooth",block:"start"})}
proToggle.onclick=()=>proCard.classList.toggle("open");
$$("[data-open='settings']").forEach(b=>b.onclick=openSettings);
$("#heroGenerate").onclick=()=>{openSettings();setTimeout(()=>$("#budget").focus(),450)};
$("#askHelper").onclick=()=>{$("#sentence").focus();$("#sentence").placeholder="告诉我预算、用途和你的偏好…"};
$("#sentenceForm").onsubmit=e=>{
 e.preventDefault();
 const text=$("#sentence").value.trim();
 const amount=text.match(/(\d+(?:\.\d+)?)\s*(万|千|k|K|元)?/);
 if(amount){let n=parseFloat(amount[1]),unit=amount[2];if(unit==="万")n*=10000;else if(unit==="千"||unit==="k"||unit==="K")n*=1000;if(n>=2500&&n<=50000){budget.value=Math.round(n/500)*500;budget.dispatchEvent(new Event("input"))}}
 const map=[["ai","AI|大模型|绘图"],["design","剪辑|设计|PS|PR|AE"],["stream","直播|推流"],["cad","CAD|建模|渲染|3D"],["office","办公|学习|网课"],["gaming","游戏|3A|电竞|开黑"]];
 const hit=map.find(([,p])=>new RegExp(p,"i").test(text));
 if(hit){state.use=hit[0];state.detail=sceneChoices[state.use].items[0][0];$$(".scene").forEach(x=>x.classList.toggle("active",x.dataset.value===state.use))}
 if(/安静|静音/.test(text))$("#quiet").checked=true;
 if(/灯|RGB|海景房/i.test(text))$("#rgb").checked=true;
 if(/全新/.test(text)){$$("#mode button").forEach(x=>x.classList.toggle("active",x.dataset.value==="new"));state.mode="new"}
 if(/二手/.test(text)){$$("#mode button").forEach(x=>x.classList.toggle("active",x.dataset.value==="used"));state.mode="used"}
 generate();$("#result").scrollIntoView({behavior:"smooth",block:"start"});
};
$("#capability").onclick=()=>{openSettings();$("#sentence").placeholder="输入你现在的 CPU、显卡、内存型号";$("#sentence").focus()};
$$("[data-part-tool]").forEach(b=>b.onclick=()=>{openSettings();$("#toast").textContent={cpu:"已打开 CPU 相关设置",gpu:"已打开显卡相关设置",board:"已打开主板搭配设置",power:"已打开电源功耗设置"}[b.dataset.partTool];$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1600)});
$$("[data-nav]").forEach(b=>b.onclick=()=>{$$(".bottom-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.nav==="home")window.scrollTo({top:0,behavior:"smooth"});if(b.dataset.nav==="build")openSettings();if(["favorites","history","mine"].includes(b.dataset.nav)){ $("#toast").textContent={favorites:"收藏会在保存方案后显示",history:"本次生成记录已保留在当前页面",mine:"无需登录即可使用装机功能"}[b.dataset.nav];$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1800)}});
generate();
