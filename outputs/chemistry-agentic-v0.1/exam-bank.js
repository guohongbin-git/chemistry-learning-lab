"use strict";

// Every question and option is original. Sources document the confirmed examination method,
// not a claim that the stem or answer appeared in the cited paper.
const sources = {
  zhejiang2022: { label: "浙江省教育考试院 · 2022 年 1 月试题评析", url: "https://www.zjzs.net/art/2022/1/9/art_46_4570.html", relation: "选择题覆盖分类、氧化还原、离子反应等教材基础；综合题强调提取信息与符号表征" },
  zhejiang2023: { label: "浙江省教育考试院 · 2023 年 6 月试题评析", url: "https://www.zjzs.net/art/2023/6/12/art_31_4454.html", relation: "物质分类、氧化还原与离子反应属于基础考查；实验题强调从现象到证据的推理" },
  zhejiang2024: { label: "浙江省教育考试院 · 2024 年 6 月试题评析", url: "https://www.zjzs.net/art/2024/6/11/art_31_9716.html", relation: "第 6 题涉及氧化还原与废水处理，第 8 题涉及离子反应，第 18 题涉及 PbS 富氧煅烧" },
  zhejiang2024Idea: { label: "浙江省教育考试院 · 2024 年 6 月命题思路", url: "https://www.zjzs.net/art/2024/6/11/art_31_9715.html", relation: "分类、离子反应和氧化还原等基础知识与真实情境结合" },
  zhejiang2025: { label: "浙江省教育考试院 · 2025 年 6 月试题评析", url: "https://www.zjzs.net/art/2025/6/11/art_31_11279.html", relation: "选择题前段考查物质分类、离子反应、物质溶解性等基础知识，并强调综合与分层设问" },
  pepChapter2: { label: "人民教育出版社 · 必修第一册第二章教材解读", url: "https://www.pep.com.cn/xw/zt/px/2019/huaxue/jiangyi/201906/P020190617390733465171.pdf", relation: "第二章按钠、氯和物质的量组织，强调宏观现象与微观粒子、定性认识与定量认识的衔接" },
  moeOutline: { label: "教育部 · 高考化学考试大纲", url: "https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/201610/W020161014528620110518.pdf", relation: "实验技能覆盖配制一定物质的量浓度的溶液及基本计算" }
};

const sections = {
  classification: {
    title: "第一节 · 分类与转化高考迁移",
    method: "先确定研究对象与组成，再选分类标准；遇到实验现象时，把它与粒子尺度或真实反应联系起来。",
    cases: [
      { id:"exam_class_sample", topic:"分类标准", source:"zhejiang2025", stem:"某展示台有四份样品：①纯 H₂O；②NaCl 水溶液；③O₂ 与 O₃ 的混合气体；④纯 CO₂。只选一个完全正确的判断。", options:["①是混合物，因为有两种元素","②是化合物，因为含 NaCl","③虽只含氧元素，仍是混合物","④是单质，因为只有两种元素"], answer:2, why:["元素种数不是物质种数；纯 H₂O 是化合物。","NaCl 水溶液含 NaCl 和水，是混合物。","O₂ 与 O₃ 是不同单质，共存时有两种物质。","CO₂ 是碳、氧两元素构成的化合物。"], worked:"先问每份样品有几种物质，再问纯净物由几种元素组成。③虽只有一种元素，却含 O₂、O₃ 两种物质。", transfer:"若将石墨与金刚石混合，元素仍只有碳，但物质有几种？" },
      { id:"exam_class_colloid", topic:"胶体实验", source:"zhejiang2023", stem:"向沸水滴加少量饱和 FeCl₃ 溶液，得到红褐色分散系；另向 FeCl₃ 溶液直接加入 NaOH 溶液。对两次现象的判断哪项最恰当？", options:["红褐色说明两者一定都是胶体","前者可用丁达尔效应辅助判断；后者通常生成 Fe(OH)₃ 沉淀","普通滤纸能把前者的胶体粒子全部滤出","分散质粒子越小，越容易观察到丁达尔效应"], answer:1, why:["颜色不是胶体定义；制备条件和粒子尺度要核对。","沸水水解法与直接加碱的产物分散状态不同。","胶体粒子通常可通过普通滤纸。","可见光散射与粒子尺度等有关，不能作这种单调推论。"], worked:"把‘制法—粒子尺度—可观察性质’连起来，而不是只看颜色。前者是教材制胶体方法；直接加碱通常得沉淀。", transfer:"若一束光在教室灰尘中可见，能否直接证明水样是胶体？" },
      { id:"exam_class_conversion", topic:"性质与转化条件", source:"zhejiang2024Idea", stem:"某同学画出 CaO、CuO、CO₂ 的转化网络。根据常见条件，下列哪条判断正确？", options:["CaO 能与水生成碱，所以 CuO 也一定直接与水生成 Cu(OH)₂","CO₂ 含碳和氧，故是单质","CuO 能与盐酸生成盐和水，可归为碱性氧化物；但不据此推断它能直接与水反应","凡是金属氧化物都是碱性氧化物"], answer:2, why:["同类中的一个例子不能替代逐物质检验。","CO₂ 是化合物，也是酸性氧化物。","分类根据与酸的反应性质；与水反应是另一个判断。","部分金属氧化物有两性等例外，不能写绝对化结论。"], worked:"将‘属于碱性氧化物’与‘直接与水生成碱’分开判断。CuO + 2HCl → CuCl₂ + H₂O 可发生，CuO 通常不直接与水反应。", transfer:"CO₂ 与 Ca(OH)₂ 反应后产生什么现象？这属于氧化还原反应吗？" }
    ]
  },
  ionic: {
    title: "第二节 · 离子反应高考迁移",
    method: "把题干中的酸碱性、投料和物态先变成离子清单；再查反应条件、守恒与实验干扰。",
    cases: [
      { id:"exam_ion_coexist", topic:"隐含条件与大量共存", source:"zhejiang2024", stem:"一份无色溶液已知呈酸性。以下哪组离子在常见水溶液条件下可大量共存？", options:["Na⁺、K⁺、NO₃⁻、Cl⁻","Na⁺、CO₃²⁻、Cl⁻、K⁺","Ba²⁺、SO₄²⁻、NO₃⁻、H⁺","Na⁺、K⁺、OH⁻、NO₃⁻"], answer:0, why:["这些离子与酸性条件中的 H⁺ 不形成题设下的沉淀、气体或水。","CO₃²⁻ 与 H⁺ 反应产生 CO₂ 和水。","Ba²⁺ 与 SO₄²⁻ 形成难溶 BaSO₄。","OH⁻ 与 H⁺ 形成水。"], worked:"题干‘酸性’意味着要把 H⁺ 当作已知离子；再依次查沉淀、气体、水。不要只检查选项内部。", transfer:"若把题干改为碱性，哪一个隐藏离子必须加入你的检查清单？" },
      { id:"exam_ion_equation", topic:"净离子式的边界", source:"zhejiang2024", stem:"醋酸 CH₃COOH 溶液与 NaOH 溶液恰好反应。下列净离子方程式哪项正确？", options:["H⁺ + OH⁻ → H₂O","CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O","Na⁺ + OH⁻ → NaOH","CH₃COOH + Na⁺ → CH₃COONa + H⁺"], answer:1, why:["醋酸是弱酸，不能在净离子式中完全拆成 H⁺。","弱酸保留化学式；Na⁺ 是旁观离子，原子和电荷均守恒。","NaOH 在水溶液中电离，Na⁺ 不参与净反应。","Na⁺ 是旁观离子，且此式没有表示中和。"], worked:"写、拆、删、查：醋酸保留；NaOH 拆；删 Na⁺；检查两侧原子和电荷。", transfer:"若把醋酸改为稀盐酸，净离子式应怎样改变？" },
      { id:"exam_ion_test", topic:"实验检验与排干扰", source:"zhejiang2023", stem:"某无色溶液可能含 Cl⁻、CO₃²⁻、SO₄²⁻。实验者想确认 SO₄²⁻。哪一方案的证据链较完整？", options:["只加 BaCl₂，出现白色沉淀就断言一定含 SO₄²⁻","先加足量稀盐酸，确认无残留沉淀后再加 BaCl₂；若有不溶于酸的白色沉淀，支持含 SO₄²⁻","只加 AgNO₃，出现白色沉淀就断言含 SO₄²⁻","只测溶液电导率；能导电便说明含 SO₄²⁻"], answer:1, why:["BaCO₃ 等也可能形成白色沉淀；必须处理干扰。","盐酸酸化排除碳酸根等，并留意酸化时的异常沉淀；后续 BaSO₄ 是关键证据。","AgNO₃ 常用于卤离子相关检验，不能直接证明硫酸根。","导电只表示存在可移动带电粒子，不指明离子种类。"], worked:"检验不是‘看到白色就背产物’，要说明每步排除了什么干扰、留下什么证据。", transfer:"若酸化时已经出现白色沉淀，能否跳过这一步直接做硫酸根结论？" },
      { id:"exam_ion_conductivity", topic:"反应过程与电导率", source:"zhejiang2024Idea", stem:"同温下，向稀 Ba(OH)₂ 溶液逐滴加入稀 H₂SO₄，溶液总体积也在变化。哪一结论最稳妥？", options:["电导率必严格降到 0","先可能降低至低点，过量加酸后可升高；不能忽略体积和温度等条件","无论加入多少酸，电导率恒定","产生 BaSO₄ 说明所有离子都完全消失"], answer:1, why:["水仍极弱电离，且实验有杂质与测量限制，不能断言严格为零。","沉淀与水的生成消耗离子；酸过量又引入可移动离子。","参与反应的离子浓度变化，电导率不会必然恒定。","沉淀难溶不等于零离子，也可能仍有旁观离子或过量离子。"], worked:"先列参与的可移动离子，再按滴加阶段考虑消耗与过量；比较电导率时注明实验条件。", transfer:"如果把加入物改为纯水稀释，还能直接画出同样的变化曲线吗？" }
    ]
  },
  redox: {
    title: "第三节 · 氧化还原高考迁移",
    method: "面对陌生反应，先标变价元素；用升降数乘原子个数核对电子，再确定剂、反应和产物。",
    cases: [
      { id:"exam_redox_pbs", topic:"矿物情境与电子守恒", source:"zhejiang2024", stem:"某矿物焙烧示意反应为 2PbS + 3O₂ → 2PbO + 2SO₂。只根据此式判断，每反应 2 个 PbS 化学式单位，转移电子总数是多少？", options:["2 个","6 个","12 个","18 个"], answer:2, why:["只看 Pb 的个数；Pb 化合价未变。","只算了一个 S 的化合价变化。","两个 S 从 −2 到 +4，共失 12e⁻；六个 O 从 0 到 −2，共得 12e⁻。","把反应物的 O₂ 系数直接当电子数。"], worked:"Pb 始终 +2；每个 S 升 6 价，共两个 S，失 12e⁻。氧共六个原子，每个降 2 价，得 12e⁻。这是自编示意题，非 2024 浙江原题。", transfer:"若把反应式中的 PbS 系数整体扩大两倍，转移电子数怎样变化？" },
      { id:"exam_redox_agent", topic:"氧化剂与配平", source:"zhejiang2022", stem:"氯气氧化 FeCl₂ 得 FeCl₃。哪项同时写对方程式和氧化剂？", options:["FeCl₂ + Cl₂ → FeCl₃；FeCl₂ 是氧化剂","2FeCl₂ + Cl₂ → 2FeCl₃；Cl₂ 是氧化剂","2FeCl₂ + Cl₂ → 2FeCl₃；FeCl₂ 是氧化剂","FeCl₂ + 2Cl₂ → FeCl₃；Cl₂ 是还原剂"], answer:1, why:["原子数未配平，且 Fe²⁺ 失电子是还原剂。","两份 Fe²⁺ 各失 1e⁻，Cl₂ 共得 2e⁻；Cl₂ 是氧化剂。","式子配平了，但把氧化剂与还原剂叫反。","原子数未配平，Cl₂ 得电子而非失电子。"], worked:"先写 Fe +2→+3、Cl 0→−1；由电子守恒得系数 2∶1∶2，再判 Cl₂ 得电子是氧化剂。", transfer:"若只问氧化产物，应追踪 Fe 还是 Cl？" },
      { id:"exam_redox_order", topic:"用反应证据比较氧化性", source:"zhejiang2024Idea", stem:"已知在同类条件下 Zn + Cu²⁺ → Zn²⁺ + Cu、Cu + 2Ag⁺ → Cu²⁺ + 2Ag 均能自发进行。哪一氧化性顺序可由给定证据推出？", options:["Zn²⁺＞Cu²⁺＞Ag⁺","Ag⁺＞Cu²⁺＞Zn²⁺","Cu²⁺＞Ag⁺＞Zn²⁺","只能比较 Zn 和 Cu，不能比较离子"], answer:1, why:["把已知反应方向反过来了。","第一条给 Cu²⁺＞Zn²⁺，第二条给 Ag⁺＞Cu²⁺。","第二条关系写反。","两条反应可链式比较三个氧化性物种。"], worked:"每条反应都用‘氧化剂强于氧化产物’作一段证据，再连接两段；结论只在给定同类条件下成立。", transfer:"若第二条反应没有说明能自发进行，还能推出完整顺序吗？" }
    ]
  },
  sodium: {
    title:"第二章第一节 · 钠及其化合物高考迁移",method:"比较反应物和条件，再用化合价、现象与守恒排除相似物质的干扰。",cases:[
      {id:"exam_na_water",topic:"实验现象与产物",source:"pepChapter2",stem:"少量钠投入足量水，滴加酚酞后溶液变红。下列解释最完整的是哪项？",options:["只生成 H₂，溶液变红与反应无关","生成 NaOH 和 H₂；NaOH 使酚酞变红","生成 Na₂O₂ 和 O₂，所以酚酞变红","钠溶于水而未发生化学反应"],answer:1,why:["还生成 NaOH，碱性使酚酞变红。","2Na+2H₂O→2NaOH+H₂，产物、现象与氧化还原均吻合。","反应条件与产物写错。","有新物质生成，属于化学反应。"],worked:"先写配平方程式，再用产物 NaOH 解释指示剂变化；气泡对应 H₂。",transfer:"若取用大量钠，是否仍能按课堂小量实验操作？说明安全边界。"},
      {id:"exam_na_oxides",topic:"相似氧化物辨析",source:"zhejiang2024Idea",stem:"分别将 Na₂O 和 Na₂O₂ 与水反应。哪项判断正确？",options:["二者都只生成 NaOH，化合价均不变","Na₂O₂ 中氧为 −1 价，与水反应可生成 O₂","Na₂O 中氧为 −1 价，故一定放出 O₂","Na₂O₂ 与水不反应"],answer:1,why:["Na₂O₂ 可生成 O₂，且氧化态变化。","过氧化物的氧为 −1 价，2Na₂O₂+2H₂O→4NaOH+O₂↑。","普通氧化物 Na₂O 中氧为 −2 价。","过氧化钠能与水反应。"],worked:"先核对氧元素化合价，再分别写反应；同含 Na、O 不代表性质相同。",transfer:"Na₂O₂ 与 CO₂ 反应时氧气来自哪一种反应物中的氧？"},
      {id:"exam_na_carbonates",topic:"碳酸盐实验推理",source:"zhejiang2025",stem:"等质量的 Na₂CO₃ 与 NaHCO₃ 固体分别充分加热，哪项与常见实验事实一致？",options:["Na₂CO₃ 更易分解放出 CO₂","NaHCO₃ 可分解放出 CO₂ 和 H₂O","二者都生成 NaCl","NaHCO₃ 中不存在碳酸相关粒子"],answer:1,why:["常见加热条件下 Na₂CO₃ 比 NaHCO₃ 更稳定。","2NaHCO₃→Na₂CO₃+CO₂↑+H₂O。","反应物无氯元素。","NaHCO₃ 是碳酸氢盐。"],worked:"先记反应条件与产物，再用元素守恒排除不可能的选项。",transfer:"向两者的溶液中分别滴加稀盐酸，怎样依据反应速率和投料条件解释观察差异？"}
    ]
  },
  chlorine: {
    title:"第二章第二节 · 氯及其化合物高考迁移",method:"列出新制氯水的成分，辨明氧化、酸性和沉淀证据，检查试剂是否引入待检离子。",cases:[
      {id:"exam_cl_water",topic:"氯水成分与漂白",source:"pepChapter2",stem:"新制氯水可使湿润的有色纸褪色。对该现象的解释哪项恰当？",options:["干燥 Cl₂ 本身在任何条件下都直接漂白","Cl₂ 与水反应生成的 HClO 有氧化性","氯水是只含 HClO 的纯净物","褪色说明溶液中没有 Cl⁻"],answer:1,why:["忽略了水参与形成的活性物质。","Cl₂+H₂O⇌HCl+HClO，HClO 与漂白相关。","氯水含水与多种溶质，是混合物。","氯水同时可含 Cl⁻。"],worked:"从氯气和水的可逆反应推混合物组成，再给现象找可能的活性成分。",transfer:"久置氯水见光后成分会怎样变化，漂白能力还能直接等同新制氯水吗？"},
      {id:"exam_cl_test",topic:"检验中的试剂干扰",source:"zhejiang2023",stem:"要检验未知水溶液原本是否含 Cl⁻，哪种操作更能避免试剂造成假阳性？",options:["先用盐酸酸化，再加 AgNO₃","先用稀硝酸酸化，再加 AgNO₃ 并观察白色沉淀","先加 NaCl，再加 AgNO₃","只测溶液是否导电"],answer:1,why:["盐酸会引入 Cl⁻。","稀硝酸不引入 Cl⁻；AgCl 白色沉淀为支持证据，还需结合样品条件。","NaCl 也会引入 Cl⁻。","导电不能识别特定离子。"],worked:"检验目标离子前，先列出每步试剂带来的离子。",transfer:"若原溶液可能含其他可与 Ag⁺ 沉淀的阴离子，还应怎样设计排干扰步骤？"},
      {id:"exam_cl_bleach",topic:"生活情境的反应风险",source:"zhejiang2024Idea",stem:"84 消毒液中常见有效成分为 NaClO。哪项说法正确？",options:["与酸性洁厕剂混合能提高安全性","NaClO 中氯元素为 +1 价；酸性条件下混用可能产生有毒 Cl₂","84 消毒液是纯 NaClO 固体","只要没有闻到气味就说明混用安全"],answer:1,why:["酸化并混合含氯物可能放出 Cl₂。","化合价计算与安全现象均正确。","商品为水溶液混合物。","气味不能作为安全判据。"],worked:"先由 Na⁺、O²⁻ 求 Cl 的化合价，再分析 ClO⁻ 与酸及 Cl⁻ 可能发生的反应。",transfer:"为什么不能仅凭‘有消毒作用’判断两种清洁剂可以混用？"}
    ]
  },
  mole: {
    title:"第二章第三节 · 物质的量高考迁移",method:"每一步写明粒子对象与单位；使用气体体积关系前先核温度、压强和物态。",cases:[
      {id:"exam_mol_particles",topic:"粒子对象",source:"pepChapter2",stem:"关于 1 mol NaCl 晶体的表述，哪项准确？",options:["含 1 mol 独立 NaCl 分子","含 1 mol Na⁺ 和 1 mol Cl⁻","含 2 mol Na⁺ 和 1 mol Cl⁻","因不导电，所以不含离子"],answer:1,why:["离子晶体以化学式单位计数，非独立 NaCl 分子。","NaCl 中 Na:Cl=1:1。","离子数与化学式不符。","固体不导电是离子不能自由移动。"],worked:"先确定 1 mol 对应 NaCl 化学式单位，再由下标给出离子比。",transfer:"1 mol CaCl₂ 化学式单位含几 mol Cl⁻？"},
      {id:"exam_mol_gas",topic:"气体摩尔体积适用条件",source:"zhejiang2024Idea",stem:"给定 25 ℃、常压下的一瓶 O₂，已知质量 16 g。下列判断最稳妥的是哪项？",options:["它一定占 11.2 L，因为 22.4 L·mol⁻¹ 到处适用","它约为 0.5 mol O₂ 分子；仅凭标准状况的 22.4 L·mol⁻¹ 不能直接算本条件体积","它约为 1 mol O₂ 分子","它含 0.5 mol O 原子"],answer:1,why:["25 ℃ 不是约 0 ℃ 的标准状况。","16/32=0.5 mol，气体体积还需本条件的信息。","O₂ 摩尔质量约 32 g·mol⁻¹。","0.5 mol O₂ 含 1 mol O 原子。"],worked:"质量先换物质的量；体积公式另需核条件。",transfer:"若改成标准状况，体积近似是多少？"},
      {id:"exam_mol_stoich",topic:"方程式系数与质量",source:"zhejiang2025",stem:"在 2H₂+O₂→2H₂O 中，若恰好消耗 2 mol H₂，哪项成立？",options:["消耗 2 mol O₂","生成 2 mol H₂O，质量约 36 g","生成 2 g H₂O","系数 2:1:2 是质量比"],answer:1,why:["O₂ 与 H₂ 的物质的量比是 1:2。","按系数得 2 mol H₂O，再乘 18 g·mol⁻¹。","少乘摩尔质量。","系数是粒子数或物质的量比。"],worked:"按系数比得 n，再用 m=nM；氧气需足量且反应按所给方程式完成。",transfer:"若氧气仅有 0.5 mol，水最多生成几 mol？"}
    ]
  },
  solution_preparation: {
    title:"第二章实验活动 · 配制溶液高考迁移",method:"先用 c=n/V 求理论值，再将每一步失误映射到溶质 n 或最终体积 V 的变化。",cases:[
      {id:"exam_sol_mass",topic:"称量计算",source:"moeOutline",stem:"用固体 NaCl 配制 500 mL、0.200 mol·L⁻¹ 溶液，M(NaCl)=58.5 g·mol⁻¹。理论称量是多少？",options:["0.100 g","5.85 g","11.7 g","58.5 g"],answer:1,why:["把物质的量误当质量。","n=cV=0.100 mol，m=nM=5.85 g。","误把 500 mL 当 1 L。","误用 1 mol 的质量。"],worked:"先换 500 mL=0.500 L，再算 0.200×0.500×58.5。",transfer:"若浓度与体积都变成原来的两倍，理论用量变几倍？"},
      {id:"exam_sol_loss",topic:"转移误差方向",source:"zhejiang2023",stem:"固体完全溶解后，部分含溶质溶液在转移中洒出，仍用容量瓶定容到刻度。所得浓度相对目标值如何？",options:["偏高，因为水被洒出","偏低，因为进入容量瓶的溶质 n 变小，最终 V 不变","不变，因为最终 V 相同","无法判断，因为没有给温度"],answer:1,why:["洒出的同时含有溶质。","c=n/V；n 减小，V 仍为标定体积。","只看 V，漏看 n。","题设误差方向已能判断。"],worked:"画一个 n/V 小表：本题 n↓、V 不变，故 c↓。",transfer:"若只是把洗涤液加进容量瓶，之后仍按刻度定容，浓度必然偏低吗？"},
      {id:"exam_sol_overfill",topic:"定容过线",source:"moeOutline",stem:"定容时水超过刻度线，未重新配制。哪项处理与判断正确？",options:["吸去上层少量液体就恢复原浓度","溶质 n 近似不变、最终 V 偏大，浓度偏低；应重新配制","超过刻度使浓度偏高","摇匀后补水即可消除误差"],answer:1,why:["吸出的是含溶质的溶液，不只吸出水。","c=n/V，过线使 V 偏大。","方向相反。","补水使 V 更大。"],worked:"定容过线改变最终体积；不要用吸取来假装恢复原来的溶质物质的量。",transfer:"若热溶液直接定容后冷却，在无挥发且热膨胀的前提下，方向是否相同？"}
    ]
  }
};

for (const section of Object.values(sections)) {
  if (!section.cases.length || new Set(section.cases.map(item => item.id)).size !== section.cases.length) throw new Error("高考训练题 ID 重复或为空");
  for (const item of section.cases) {
    if (item.options.length !== 4 || item.why.length !== 4 || !Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3 || !sources[item.source]) throw new Error(`高考训练题无效：${item.id}`);
  }
}

module.exports = { sections, sources };
