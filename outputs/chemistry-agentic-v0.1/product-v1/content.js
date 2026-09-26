window.CHEMISTRY_PRODUCT_V1 = {
  metadata: {
    name: "化学学习实验室",
    version: "1.0.0-alpha",
    contentRevision: "2026-09-25.p1.2",
    curriculum: "人教版必修第一册 · 第一章",
    status: "原型课程，依据标注待逐条核验",
    examNote: "本页训练题为课程自编。关联考试评析仅用于说明考法，不是历年真题。"
  },
  glossary: [
    { id:"pure", term:"纯净物", aliases:["纯净物"], definition:"只由一种物质组成的物质。", examples:["纯氧 O₂","纯水 H₂O"], counterexamples:["空气","盐水"], boundary:"一种纯净物可以含两种或更多元素；元素种数不能代替物质种数。" },
    { id:"mixture", term:"混合物", aliases:["混合物"], definition:"由两种或两种以上物质混合而成，各成分保持原有化学性质。", examples:["空气","食盐水"], counterexamples:["纯 O₂","纯 NaCl"], boundary:"判断整份样品中有几种物质；不要只数元素种类。" },
    { id:"substance", term:"物质", aliases:["物质种类"], definition:"具有确定组成和可描述性质的化学对象；分类时先判断一个样品含有几种不同物质。", examples:["纯水 H₂O 是一种物质","O₂ 与 O₃ 是两种不同物质"], counterexamples:["氧元素不是一种具体物质","盐水含水和氯化钠等多种物质"], boundary:"物质种数与元素种数是两个问题；先数物质，再按需要看元素组成。" },
    { id:"element", term:"元素", aliases:["元素种类"], definition:"具有相同核电荷数的一类原子的总称；元素是组成物质的基本类别，不等同于单个原子或具体物质。", examples:["¹²C 与 ¹⁴C 属于同一种碳元素","H₂O 含氢元素和氧元素"], counterexamples:["一个氧原子不是一种元素","O₂ 与 O₃ 是不同物质，但都只由氧元素组成"], boundary:"判断元素种类看原子核电荷数；判断纯净物或混合物看物质种数。" },
    { id:"ion", term:"离子", aliases:["阳离子","阴离子","离子符号"], definition:"原子或原子团得失电子后形成的带电粒子；阳离子带正电，阴离子带负电。", examples:["Na⁺、NH₄⁺ 是阳离子","Cl⁻、SO₄²⁻ 是阴离子"], counterexamples:["中性 Na 原子不是离子","HCl(g) 分子整体不带电"], boundary:"判断电荷要看上标；下标表示组成粒子数，不能读成电荷。" },
    { id:"electrolyte", term:"电解质", aliases:["电解质"], definition:"在水溶液中或熔融状态下，能自身产生可自由移动离子并导电的化合物。", examples:["NaCl","HCl","NaOH"], counterexamples:["铜能导电但不是化合物；蔗糖溶液能溶解但不产生大量离子"], boundary:"这是物质类别；干燥 NaCl 晶体暂时不导电，不改变 NaCl 是电解质的分类。" },
    { id:"nonelectrolyte", term:"非电解质", aliases:["非电解质"], definition:"在水溶液中和熔融状态下都不能自身产生可自由移动离子导电的化合物。", examples:["蔗糖","乙醇"], counterexamples:["NaCl 是电解质","铜能导电但它是单质，不属于非电解质"], boundary:"溶于水不等于电离；非电解质与电解质都是化合物分类，不能用当前样品是否点亮灯泡代替判断。" },
    { id:"solution", term:"溶液", aliases:["溶质","溶剂","水溶液"], definition:"一种或多种物质均匀分散在另一种物质中形成的均一、稳定混合物。", examples:["NaCl 水溶液","蔗糖水溶液"], counterexamples:["纯水不是溶液","泥水静置后分层，不是均一稳定溶液"], boundary:"溶质可主要以离子或中性分子存在；是不是溶液和能不能导电是两个判断。" },
    { id:"acid", term:"酸", aliases:["酸性","酸类"], definition:"高中常用分类：电离时产生的阳离子全部是 H⁺ 的化合物。水溶液中常用 H₃O⁺ 表示实际水合粒子。", examples:["HCl、H₂SO₄ 是常见酸","HNO₃ 电离产生 H⁺ 和 NO₃⁻"], counterexamples:["NaHSO₄ 含 H，但电离产生 Na⁺，是酸式盐","NO₃⁻ 是酸根离子，不是酸"], boundary:"不能只看化学式里有没有 H；要看物质类别与电离组成。HCl(g) 是氯化氢气体，盐酸是 HCl(aq) 溶液。" },
    { id:"hydrochloric-acid", term:"盐酸", aliases:["HCl(aq)","氢氯酸"], definition:"氯化氢气体溶于水形成的水溶液，是含溶质、溶剂和水合离子的混合物。", examples:["实验室稀盐酸","盐酸中主要有 H₃O⁺、Cl⁻ 和水分子"], counterexamples:["HCl(g) 是氯化氢气体这一纯物质","Cl⁻ 是氯离子，不等于整份盐酸"], boundary:"HCl(aq) 的 (aq) 表示水溶液状态；日常说“盐酸”通常指溶液，不是纯 HCl 液体。" },
    { id:"base", term:"碱", aliases:["碱性","碱类"], definition:"高中常用分类：电离时产生的阴离子全部是 OH⁻ 的化合物。", examples:["NaOH、Ba(OH)₂","难溶的 Cu(OH)₂ 仍属于碱"], counterexamples:["乙醇含有 —OH 共价基团，不是碱","OH⁻ 是离子，不是化合物"], boundary:"分子里出现 O 和 H 不等于含有 OH⁻；看离子组成与物质类别。" },
    { id:"salt", term:"盐", aliases:["正盐","酸式盐","盐类"], definition:"由金属阳离子（或 NH₄⁺）与酸根阴离子构成的化合物；高中常用分类判据。", examples:["NaCl 是盐","NaHCO₃、NaHSO₄ 是酸式盐，也属于盐"], counterexamples:["HCl 是酸，不是盐","NO₃⁻ 是酸根离子，不是盐"], boundary:"酸式盐中的 H 不会把整种物质变成酸；HNO₃ 是酸，NO₃⁻ 是酸根，NaNO₃ 是盐。" },
    { id:"acid-radical", term:"酸根离子", aliases:["酸根","硝酸根","硫酸根","碳酸根"], definition:"酸电离后留下的阴离子；它带负电，能与阳离子组成盐。", examples:["HNO₃ 对应 NO₃⁻（硝酸根）","H₂SO₄ 对应 SO₄²⁻（硫酸根）；H₂CO₃ 对应 CO₃²⁻（碳酸根）"], counterexamples:["HNO₃ 是酸，不是酸根离子","NaNO₃ 是硝酸盐，不是单独的 NO₃⁻"], boundary:"“硝酸根”名称指 NO₃⁻ 这个带电粒子；酸与酸根相关，但不是同一个对象。" },
    { id:"conduction", term:"导电", aliases:["导电","电导"], definition:"体系中的带电粒子能够定向移动而形成电流。溶液中主要靠离子，金属中主要靠自由电子。", examples:["NaCl 水溶液中的 Na⁺、Cl⁻","铜丝中的自由电子"], counterexamples:["晶格中不能自由迁移的 Na⁺、Cl⁻","主要以中性分子存在的蔗糖水溶液"], boundary:"纯水极弱导电；普通小灯泡不亮不等于电导率严格为零。" },
    { id:"aq", term:"(aq)", aliases:["aq","水溶液"], definition:"aqueous 的缩写，表示该物质处于水溶液中；(s)、(l)、(g) 分别表示固态、液态、气态。", examples:["HCl(aq) 表示盐酸中的溶质状态","NaCl(aq) 表示氯化钠水溶液"], counterexamples:["HCl(g) 是氯化氢气体，不是盐酸","(aq) 不表示纯水"], boundary:"符号标明状态；物质名称还要结合语境。盐酸是混合物，HCl 是其中的溶质。" },
    { id:"solubility", term:"可溶、难溶与溶解性", aliases:["溶解性","可溶","难溶"], definition:"描述某物质在给定条件下溶解能力的性质。“难溶”表示溶解度很小，不等于绝对不溶。", examples:["NaNO₃ 易溶于水","BaSO₄ 难溶于水"], counterexamples:["不能仅凭溶液无色推断没有沉淀","浓度和条件不足时不能断言必有可见沉淀"], boundary:"初学时记常见规律和高频例外；遇到少见物质查表，定量判断还需浓度与溶度积。" },
    { id:"precipitate", term:"沉淀", aliases:["沉淀","沉淀反应"], definition:"在溶液反应中生成并析出的难溶固体。离子方程式用 (s) 或 ↓ 标出。", examples:["Ba²⁺ + SO₄²⁻ → BaSO₄(s)","Ag⁺ + Cl⁻ → AgCl(s)"], counterexamples:["NaCl(aq) 与 KNO₃(aq) 混合通常无沉淀","原子守恒但物态写成 BaSO₄(aq) 仍不正确"], boundary:"真实析出与离子浓度、条件有关；高中定性题先读清题给条件并查溶解性。" },
    { id:"netionic", term:"旁观离子与净离子方程式", aliases:["旁观离子","净离子方程式"], definition:"旁观离子在反应前后没有变化；净离子方程式只保留实际发生变化的粒子。", examples:["Ba²⁺ + SO₄²⁻ → BaSO₄(s)","Ag⁺ + Cl⁻ → AgCl(s)"], counterexamples:["不能把沉淀 BaSO₄ 拆成离子","守恒正确也要检查物态与反应条件"], boundary:"只拆水溶液中的可溶性强电解质；弱电解质、气体、沉淀等通常保留化学式。" },
    { id:"redox", term:"氧化还原反应", aliases:["氧化还原","氧化剂","还原剂"], definition:"反应前后有元素化合价变化的反应；从电子角度看有电子得失或共用电子对偏移。", examples:["Zn + Cu²⁺ → Zn²⁺ + Cu","2Na + Cl₂ → 2NaCl"], counterexamples:["Ba²⁺ + SO₄²⁻ → BaSO₄(s) 没有化合价变化","中和反应通常不是氧化还原反应"], boundary:"化合价升高对应失电子、被氧化；化合价降低对应得电子、被还原。先找变化，不要只凭反应类型判断。" },
    { id:"simple-substance", term:"单质", aliases:["单质"], definition:"由同一种元素组成的纯净物。", examples:["纯 O₂","纯 Fe"], counterexamples:["H₂O 含两种元素，是化合物","O₂ 与 O₃ 混合是混合物"], boundary:"先确认整份样品是纯净物，再看是否只含一种元素。" },
    { id:"compound", term:"化合物", aliases:["化合物"], definition:"由不同种元素组成的纯净物。", examples:["纯 H₂O","纯 NaCl"], counterexamples:["O₂ 是单质","食盐水是混合物"], boundary:"“含多种元素”不足以判断为化合物；整份样品还须只含一种物质。" },
    { id:"oxide", term:"氧化物", aliases:["氧化物"], definition:"由氧元素和另一种元素组成的化合物。", examples:["CO₂","CaO"], counterexamples:["O₂ 是单质","H₂SO₄ 含三种元素，不是氧化物"], boundary:"先检查它是化合物，再数元素种类；性质分类还要看具体物质。" },
    { id:"dispersion", term:"分散系", aliases:["分散质","分散剂"], definition:"一种或多种物质分散在另一种物质中形成的混合体系。", examples:["食盐水","题设 Fe(OH)₃ 胶体"], counterexamples:["题设纯 H₂O 不是溶质分散在水中的混合体系","分散质粒子不是所有情况下都相同大小"], boundary:"按分散质粒子尺度可区分溶液、胶体和浊液；范围是高中常用近似。" },
    { id:"colloid", term:"胶体", aliases:["丁达尔效应"], definition:"分散质粒子尺度约 1—100 nm 的分散系；光穿过时可能观察到散射光路。", examples:["按题设制得的 Fe(OH)₃ 胶体","某些雾属于气溶胶"], counterexamples:["NaCl 水溶液通常按溶液处理","泥水通常按浊液处理"], boundary:"丁达尔效应是线索；光源、浓度和背景会影响肉眼观察，不用颜色或一次看不到光路做绝对判断。" },
    { id:"oxidation-state", term:"化合价", aliases:["氧化数","化合价升降"], definition:"用于表示元素在化合物或离子中结合关系的形式数值；比较反应前后化合价有助判断氧化还原。", examples:["Zn 从 0 变为 +2","Cu 从 +2 变为 0"], counterexamples:["沉淀产生本身不代表化合价变化","化学式里下标 2 不直接表示化合价"], boundary:"单质中元素化合价通常记为 0；离子中各元素化合价代数和等于离子电荷。" },
    { id:"electron-balance", term:"电子守恒", aliases:["得失电子守恒"], definition:"在完整氧化还原反应中，失去的电子总数等于得到的电子总数。", examples:["2Na + Cl₂ → 2NaCl：失 2e⁻、得 2e⁻","Zn + Cu²⁺ → Zn²⁺ + Cu：失 2e⁻、得 2e⁻"], counterexamples:["只算 Cl₂ 中一个氯原子的变化，漏掉另一个","电子数相等后仍未核对原子或电荷"], boundary:"先算每个变价原子，再乘原子个数和方程式系数。" }
  ],
  assessmentGuides: {
    "class-q1": { pattern:"按物质种数区分纯净物与混合物", mainErrorType:"把元素种数当成物质种数", mainMisconception:"判断纯净物或混合物时数错了对象：应数样品中的物质种类，不能数元素种类。", transferErrorType:"把元素种数当成物质种数", transferMisconception:"O₂ 是一种物质，含一种元素；这两个事实不能推出它是混合物。" },
    "class-q2": { pattern:"同素异形体混合物的分类", mainErrorType:"忽略同种元素可形成不同物质", mainMisconception:"把“只含一种元素”误当成“只含一种物质”；O₂ 和 O₃ 是不同物质。", transferErrorType:"忽略同种元素可形成不同物质", transferMisconception:"金刚石和石墨都是碳单质，但属于两种不同物质，混合后是混合物。" },
    "class-q3": { pattern:"化学式、名称与状态共同判定物质", mainErrorType:"忽略状态标记并混淆溶质与溶液", mainMisconception:"HCl(g) 是氯化氢气体；HCl(aq) 指氯化氢的水溶液，盐酸整体是混合物。", transferErrorType:"把溶液名称当成纯物质", transferMisconception:"稀硫酸含有硫酸和水；不能把溶液与其中的溶质当成同一对象。" },
    "conduct-q1": { pattern:"离子存在与离子能否自由迁移", mainErrorType:"把有离子误当成离子能移动", mainMisconception:"NaCl 晶体中确实有 Na⁺、Cl⁻，但它们主要固定在晶格位置，不能自由迁移。", transferErrorType:"把固态粒子限制套用到熔融态", transferMisconception:"熔融后晶格不再固定离子位置；Na⁺、Cl⁻ 能迁移并导电。" },
    "conduct-q2": { pattern:"电解质与金属导体的概念辨析", mainErrorType:"把导电性质等同于电解质类别", mainMisconception:"铜能导电，但铜是单质，靠自由电子导电；电解质必须是符合定义的化合物。", transferErrorType:"把混合物误当成电解质", transferMisconception:"盐酸整体是混合物；其中的 HCl 在水中形成可移动离子。要区分溶液导电与物质类别。" },
    "conduct-q3": { pattern:"溶解与电离的区别", mainErrorType:"把溶解误当成电离", mainMisconception:"蔗糖溶于水后主要以中性分子存在；能溶解不等于产生可移动离子。", transferErrorType:"根据粒子组成迁移判断电离", transferMisconception:"葡萄糖由 C、H、O 元素组成且易溶于水，但主要仍是中性分子。" },
    "ionic-q1": { pattern:"依据溶解性预测沉淀", mainErrorType:"漏用溶解性规律判断产物", mainMisconception:"要把 Ba²⁺ 与 SO₄²⁻ 配对，并判断 BaSO₄ 难溶；不能只停留在反应物可溶。", transferErrorType:"漏用常见沉淀规律", transferMisconception:"Ag⁺ 与 Cl⁻ 形成难溶 AgCl；在常见水溶液定性条件下可预测沉淀。" },
    "ionic-q2": { pattern:"判断复分解反应是否有净反应", mainErrorType:"把离子交换形式当成反应发生证据", mainMisconception:"假想产物都易溶、粒子没有净变化时，不能仅因交换了写法就断言发生净离子反应。", transferErrorType:"忽略沉淀生成导致离子被消耗", transferMisconception:"AgCl 是沉淀，Ag⁺ 和 Cl⁻ 生成固体并从溶液粒子中移出，存在净离子反应。" },
    "ionic-q3": { pattern:"净离子方程式的物态与守恒", mainErrorType:"把难溶固体标成水溶液", mainMisconception:"BaSO₄ 难溶，沉淀应标 (s) 或 ↓；写离子方程式还需检查真实产物和电荷守恒。", transferErrorType:"把难溶固体拆成自由离子", transferMisconception:"难溶 Mg(OH)₂ 作为固体反应物时不拆成 Mg²⁺、OH⁻；拆分规则要结合状态与溶解性。" },
    "redox-q1": { pattern:"用化合价变化判断氧化还原反应", mainErrorType:"未逐元素比较反应前后的化合价", mainMisconception:"Na 从 0 升至 +1，Cl 从 0 降至 −1；是否含氧不是氧化还原判断标准。", transferErrorType:"把是否含氧当作分类标准", transferMisconception:"Zn 从 0 升至 +2，Cu 从 +2 降至 0；不含氧也可能是氧化还原反应。" },
    "redox-q2": { pattern:"依据电子得失判断氧化剂与还原剂", mainErrorType:"混淆氧化剂与还原剂角色", mainMisconception:"Cu²⁺ 得电子、化合价降低，自身被还原，是氧化剂；试剂名称看它促使对方发生的变化。", transferErrorType:"混淆失电子物质的角色名称", transferMisconception:"Zn 失电子、化合价升高，自身被氧化，是还原剂。" },
    "redox-q3": { pattern:"区分反应现象与氧化还原分类标准", mainErrorType:"把沉淀现象误当成化合价变化", mainMisconception:"有沉淀只能说明形成难溶固体；是否氧化还原仍要逐元素检查化合价。", transferErrorType:"把化合反应类型误当成氧化还原依据", transferMisconception:"CaO 与 H₂O 化合，但元素化合价没有改变，因此不是氧化还原反应。" }
  },
  reasonRubrics: {
    "class-q1": { main:["先数样品中的物质：只有 H₂O 一种。","再说明含两种元素对应化合物，不等于混合物。"], transfer:["说明 O₂ 是一种具体物质，因此是纯净物。","说明只含一种元素对应单质，不是混合物判据。"] },
    "class-q2": { main:["指出 O₂ 与 O₃ 是两种不同物质。","说明元素种数相同不改变混合物判断。"], transfer:["指出金刚石与石墨是不同单质、不同物质。","据物质种数得出混合后是混合物。"] },
    "class-q3": { main:["解释 (g) 表示气态，(aq) 表示水溶液状态。","区分纯 HCl 物质与含水的盐酸溶液。"], transfer:["指出稀硫酸还含水，是溶液。","区分溶质化学式与整份溶液样品。"] },
    "conduct-q1": { main:["承认晶体中存在 Na⁺、Cl⁻。","指出晶格束缚使离子不能自由迁移。"], transfer:["说明熔融后晶格固定排列被破坏。","指出可移动离子能够形成电流。"] },
    "conduct-q2": { main:["指出铜是单质，不是化合物。","说明金属靠自由电子导电，导电不等于电解质。"], transfer:["说明盐酸整体是水溶液、属于混合物。","指出 HCl 溶于水形成可移动离子，因此盐酸能导电。"] },
    "conduct-q3": { main:["区分溶解与电离两个过程。","指出蔗糖在水中主要保持中性分子。"], transfer:["指出葡萄糖溶于水后主要是分子。","用可移动离子数量解释课堂电路的导电现象。"] },
    "ionic-q1": { main:["把 Ba²⁺ 与 SO₄²⁻ 配对。","指出 BaSO₄ 难溶并在题设条件下形成沉淀。"], transfer:["把 Ag⁺ 与 Cl⁻ 配对。","指出 AgCl 难溶并写出固态沉淀。"] },
    "ionic-q2": { main:["写出或辨认可能生成的盐，再查其溶解性。","指出没有沉淀、气体或水等驱动力，离子无净变化。"], transfer:["指出 AgCl 是难溶固体。","保留 Ag⁺、Cl⁻ 为反应离子，排除 Na⁺、NO₃⁻。"] },
    "ionic-q3": { main:["指出 BaSO₄ 难溶，应为固态 (s) 或沉淀符号。","提醒方程式还要检查原子、电荷与物态。"], transfer:["指出 Mg(OH)₂ 是难溶固体。","说明固体不能拆为水溶液中的自由离子。"] },
    "redox-q1": { main:["比较 Na：化合价从 0 升到 +1。","比较 Cl：化合价从 0 降到 −1，并据此判断。"], transfer:["比较 Zn：0 升到 +2；Cu：+2 降到 0。","说明是否含氧不是必要条件。"] },
    "redox-q2": { main:["指出 Cu²⁺ 得电子、化合价降低。","明确自身被还原，却作为氧化剂。"], transfer:["指出 Zn 失电子、化合价升高。","明确自身被氧化，却作为还原剂。"] },
    "redox-q3": { main:["指出生成沉淀属于反应现象或反应类型信息。","逐元素比较价态不变，因此不是氧化还原。"], transfer:["识别化合反应不自动等于氧化还原反应。","指出 Ca、H、O 反应前后化合价未变。"] }
  },
  examPatternNote: "课程自编题，标签表示训练的命题能力模式，不映射到某一道历年真题；地区与教材适配仍待核验。",
  units: [
    {
      id:"classification", number:"01", title:"物质分类", subtitle:"先数物质，再看元素", duration:"约 12 分钟", images:["classification-tree","classification-cross"], skill:"分类判据",
      objective:"区分物质种类与元素种类，用正确判据分类。",
      prerequisite:"初中回顾：元素种类与物质种类是两个问题。纯 H₂O 含两种元素，但只是一种物质。", prerequisiteCheck:{stem:"纯 H₂O 只含 H、O 两种元素，所以一定是混合物。",options:["正确","不正确"],answer:1,why:"元素种类不能替代物质种类。纯 H₂O 是纯净物，也是化合物。"},
      remember:"必须记：混合物由两种或两种以上物质组成。判断时先看样品包含几种物质，不先数元素。",
      explanation:"从教材分类关系图开始：先把物质分成纯净物与混合物，再把纯净物按元素组成分为单质与化合物。不同分类标准会交叉，Na₂CO₃ 可同时是钠盐和碳酸盐。",
      positive:["纯 CO₂：一种化合物，是纯净物。","空气：含多种物质，是混合物。","O₂：一种单质，是纯净物。"],
      counterexample:["H₂O 含两种元素，仍是纯净物。","O₂ 与 O₃ 混在一起只含氧元素，却有两种物质，因此是混合物。"],
      activity:"看原图的分类标准，找到样品节点后再沿图向下读。不要用后一个分类标准反推前一个分类。",
      guidedLesson:{
        title:"跟着教材原图读：先分类，再细分",
        intro:"先沿原图的箭头从上往下看。每走到一次分叉，就问自己：这一层用的判断标准是什么？",
        steps:[
          {title:"第一层：数样品中的物质种类",read:"从“物质”往下看，第一处分成“混合物”和“纯净物”。",explain:"这一层只看样品里有几种不同物质，不数元素。混合物由两种或两种以上不同物质组成；只有一种物质组成的样品是纯净物。",examples:["空气含氮气、氧气等多种物质，是混合物。","纯水 H₂O 只有一种物质，是纯净物；即使它含氢、氧两种元素也不变。"],takeaway:"判断混合物或纯净物：先数物质种类。"},
          {title:"第二层：对纯净物看元素组成",read:"沿“纯净物”继续向下，才分成“单质”和“化合物”。",explain:"单质由同一种元素组成；化合物由两种或两种以上元素组成。这个标准只用于纯净物，不能拿来代替第一层的物质种数判断。",examples:["纯 O₂ 是一种单质，也是一种纯净物。","纯 CO₂ 是一种化合物，也是一种纯净物。"],takeaway:"单质 / 化合物看元素种类；纯净物 / 混合物看物质种类。"},
          {title:"第三层：沿分支继续细分，分类标准可以交叉",read:"原图再把单质分成金属、非金属等；把化合物继续分成无机物、有机物，并列出氧化物、酸、碱、盐等。",explain:"树状图表示某一条分类标准下的上下位关系；交叉分类图提醒我们，同一物质可以按不同标准同时归类。",examples:["Na₂CO₃ 是化合物，也可按组成叫钠盐、按酸根叫碳酸盐。","O₂ 与 O₃ 混在一起虽然只含氧元素，但有两种物质，整份样品仍是混合物。"],takeaway:"每次先说清楚“按什么标准分”，再给物质贴类别。"}
        ]
      },
      practice:[
        {id:"class-q1",skill:"分类判据",role:"辨认规则",stem:"纯 H₂O 含氢、氧两种元素，所以是混合物。",options:["正确","不正确"],answer:1,point:"纯净物与混合物按物质种数分类。",why:"样品只有一种物质 H₂O，因此是纯净物；含两种元素说明它是化合物。",transfer:{stem:"只含 O₂ 的样品含一种元素，所以一定是混合物。",answer:1,why:"样品只有一种物质 O₂，是纯净物，也是单质。"}},
        {id:"class-q2",skill:"分类判据",role:"解释与辨析",stem:"O₂ 与 O₃ 的混合气体只含氧元素，因此属于纯净物。",options:["正确","不正确"],answer:1,point:"同种元素可形成不同物质；物质种数决定纯净物或混合物。",why:"O₂ 和 O₃ 是两种物质，混在一起后属于混合物。",transfer:{stem:"金刚石和石墨都只含碳元素；它们混在一起仍是纯净物。",answer:1,why:"金刚石和石墨是两种不同单质，混合后是混合物。"}},
        {id:"class-q3",skill:"物质名称与状态",role:"迁移",stem:"盐酸 HCl(aq) 与氯化氢 HCl(g) 是同一种状态的纯物质。",options:["正确","不正确"],answer:1,point:"名称、化学式和状态标记共同限定讨论对象。",why:"HCl(g) 表示氯化氢气体；HCl(aq) 指水溶液中的氯化氢，盐酸是溶液混合物。",transfer:{stem:"纯硫酸 H₂SO₄ 与稀硫酸 H₂SO₄(aq) 都是单一纯物质。",answer:1,why:"稀硫酸含硫酸和水，是溶液混合物；只写硫酸时仍需结合语境确认。"}}
      ],
      reviewQuestions:[
        {id:"class-review-1",stem:"样品只含 CO₂；它含碳、氧两种元素。应怎样分类？",options:["纯净物、化合物","混合物、单质","纯净物、单质"],answer:0,why:"只含一种物质，因此是纯净物；由两种元素组成，因此是化合物。"},
        {id:"class-review-2",stem:"一杯 NaCl(aq) 只含 NaCl 一种物质，所以整杯是纯净物。",options:["正确","不正确"],answer:1,why:"整杯溶液还含水；盐水是混合物。"},
        {id:"class-review-3",stem:"O₂ 与 O₃ 混合物只含氧元素，因此是纯净物。",options:["正确","不正确"],answer:1,why:"O₂ 和 O₃ 是两种不同物质，混合后是混合物；元素种数不能替代物质种数。"}
      ],
      source:"分类关系图来自本地人教版课程资源；本单元练习为课程自编。"
    },
    {
      id:"conductivity", number:"02", title:"导电与电解质", subtitle:"看带电粒子能不能移动", duration:"约 15 分钟", image:"conductivity", skill:"粒子与导电",
      objective:"说明水溶液、熔融盐和金属如何导电，并区分电解质和导体。",
      prerequisite:"初中回顾：电流需要可移动的带电粒子。金属通常由自由电子导电；盐溶液由离子导电。", prerequisiteCheck:{stem:"干燥 NaCl 晶体里没有离子。",options:["正确","不正确"],answer:1,why:"NaCl 晶体含 Na⁺、Cl⁻；固态时它们主要固定在晶格位置，不能自由迁移。"},
      remember:"必须记：电解质是能在水溶液或熔融状态下自身产生可移动离子并导电的化合物。物质分类与某个样品此刻是否导电是两个判断。",
      explanation:"先区分粒子，再看状态。NaCl 晶体中离子被束缚；NaCl 水溶液和熔融 NaCl 中离子能移动。铜用自由电子导电，不属于电解质；蔗糖溶于水主要仍是中性分子。HCl(g) 与盐酸也不能混为一谈。",
      positive:["NaCl：化合物，属于电解质；晶体通常不导电，水溶液和熔融状态能导电。","HCl：电解质；HCl(aq) 中的可移动离子使盐酸导电。","铜：导体，由电子导电。"],
      counterexample:["蔗糖 C₁₂H₂₂O₁₁ 易溶于水，但不因此电离成大量离子。","理想纯水极弱导电；普通灯泡不亮不等于电导率为零。"],
      activity:"打开导电粒子模拟，切换晶体、溶液、熔融状态、分子溶液和铜。先预测载流粒子，再播放迁移示意。动画是粒子模型，不是实拍。",
      practice:[
        {id:"conduct-q1",skill:"粒子与导电",role:"辨认规则",stem:"干燥 NaCl 晶体含离子，所以其中离子可以自由迁移并使晶体导电。",options:["正确","不正确"],answer:1,point:"区分粒子存在与粒子可移动。",why:"晶格中的 Na⁺、Cl⁻ 不能像溶液中的离子一样自由迁移。",transfer:{stem:"NaCl 熔融后，Na⁺、Cl⁻ 可以移动并导电。",answer:0,why:"熔融破坏离子晶格的固定排列，离子可移动。"}},
        {id:"conduct-q2",skill:"电解质与导体",role:"解释与辨析",stem:"铜丝能导电，因此铜是电解质。",options:["正确","不正确"],answer:1,point:"电解质是化合物类别；导电是一种性质。",why:"铜是单质，由自由电子导电；导电的物质不一定是电解质。",transfer:{stem:"盐酸是混合物，却能导电；HCl 是其中的电解质溶质。",answer:0,why:"溶液导电来自 HCl 在水中形成的可移动离子；盐酸本身是混合物。"}},
        {id:"conduct-q3",skill:"状态与溶质",role:"迁移",stem:"蔗糖溶于水后，溶液中的蔗糖主要变成可移动的带电离子。",options:["正确","不正确"],answer:1,point:"溶解不等于电离；水溶液中未必有大量离子。",why:"蔗糖主要以中性分子分散在水中，普通课堂灯泡通常不会明显发亮。",transfer:{stem:"葡萄糖 C₆H₁₂O₆ 溶于水后主要保持中性分子。",answer:0,why:"葡萄糖能溶于水，但不因此产生大量带电离子。"}}
      ],
      reviewQuestions:[
        {id:"conduct-review-1",stem:"HCl(g) 与 HCl(aq) 的载流粒子相同，因此二者导电情况相同。",options:["正确","不正确"],answer:1,why:"气态 HCl 主要是中性分子；盐酸中有水合氢离子和 Cl⁻ 等可移动离子。"},
        {id:"conduct-review-2",stem:"铜丝能导电，因此铜属于电解质。",options:["正确","不正确"],answer:1,why:"铜是单质，靠自由电子导电；电解质是化合物类别。"},
        {id:"conduct-review-3",stem:"极高纯度水不能让普通灯泡明显发亮，所以电导率严格等于零。",options:["正确","不正确"],answer:1,why:"水会极微弱自电离，电导率很低但不为零；普通灯泡灵敏度有限。"}
      ],
      source:"课件中的导电实验图来自本地课程资源；本单元练习为课程自编。"
    },
    {
      id:"ionic", number:"03", title:"难溶物与离子反应", subtitle:"先预测，再配方程式", duration:"约 16 分钟", image:"ionic", skill:"溶解性与离子方程式",
      objective:"根据给定的溶解性判断沉淀，并从完整离子式写出净离子式。",
      prerequisite:"初中回顾：水溶液中的物质可以含离子。反应前后原子守恒，离子方程式还要检查电荷。", prerequisiteCheck:{stem:"Ba²⁺ 与 SO₄²⁻ 形成的 BaSO₄ 在水中易溶。",options:["正确","不正确"],answer:1,why:"BaSO₄ 难溶于水，是高中常见沉淀之一。"},
      remember:"必须记：难溶不是绝对不溶。先列溶液中的离子、交换可能组合、查溶解性，再标沉淀；最后检查原子、电荷、物态和条件。",
      explanation:"高频记忆可以先记“硝酸盐和多数钠盐、钾盐、铵盐易溶”，再记常见沉淀 BaSO₄、AgCl、CaCO₃。遇到边界或题给例外时以题目条件为准。沉淀生成常推动复分解反应；写净离子式只保留发生变化的离子。",
      positive:["BaCl₂(aq) 与 Na₂SO₄(aq)：生成 BaSO₄(s)。","AgNO₃(aq) 与 NaCl(aq)：生成 AgCl(s)。","CaCl₂(aq) 与 Na₂CO₃(aq)：生成 CaCO₃(s)。"],
      counterexample:["NaCl(aq) 与 KNO₃(aq) 混合，通常无沉淀、气体或水生成。","“难溶”指溶解能力很小；定量析出还取决于离子浓度和条件。"],
      activity:"打开沉淀模型，选择两种溶液并混合。观察哪些离子留在溶液中、哪些组成固体；随后切换完整离子式与净离子式。",
      practice:[
        {id:"ionic-q1",skill:"常见溶解性",role:"辨认规则",stem:"在常见水溶液定性条件下，BaCl₂ 与 Na₂SO₄ 混合可生成 BaSO₄ 沉淀。",options:["正确","不正确"],answer:0,point:"识记常见沉淀，并用给定离子组合判断。",why:"Ba²⁺ 与 SO₄²⁻ 形成难溶 BaSO₄(s)。",transfer:{stem:"在常见水溶液定性条件下，AgNO₃ 与 NaCl 混合可生成 AgCl 沉淀。",answer:0,why:"Ag⁺ 与 Cl⁻ 形成难溶 AgCl(s)。"}},
        {id:"ionic-q2",skill:"反应条件与驱动力",role:"解释与辨析",stem:"NaCl(aq) 与 KNO₃(aq) 混合后，只要交换阴阳离子就一定发生净离子反应。",options:["正确","不正确"],answer:1,point:"复分解反应需有沉淀、气体或弱电解质等驱动力。",why:"假想产物 NaNO₃、KCl 都易溶，溶液中的离子没有净变化，通常不写离子反应。",transfer:{stem:"题给 AgCl 为难溶物，混合 AgNO₃(aq) 与 NaCl(aq) 可写净离子式 Ag⁺ + Cl⁻ → AgCl(s)。",answer:0,why:"生成沉淀，Ag⁺ 与 Cl⁻ 被消耗；Na⁺、NO₃⁻ 是旁观离子。"}},
        {id:"ionic-q3",skill:"守恒与物态",role:"迁移",stem:"Ba²⁺ + SO₄²⁻ → BaSO₄(aq) 可以正确表示 BaSO₄ 沉淀生成。",options:["正确","不正确"],answer:1,point:"净离子式同时核对守恒、真实产物和状态。",why:"BaSO₄ 在题设条件下为固体沉淀，应写 BaSO₄(s) 或 BaSO₄↓。",transfer:{stem:"Mg(OH)₂ 是难溶固体；它与酸反应写离子方程式时仍拆成 Mg²⁺ 和 OH⁻。",answer:1,why:"难溶固体不拆成离子；按反应条件写化学式并配平。"}}
      ],
      reviewQuestions:[
        {id:"ionic-review-1",stem:"混合 BaCl₂(aq) 和 Na₂SO₄(aq) 后，哪一项是净离子方程式？",options:["Ba²⁺ + SO₄²⁻ → BaSO₄(s)","Na⁺ + Cl⁻ → NaCl(s)","Ba²⁺ + SO₄²⁻ → BaSO₄(aq)"],answer:0,why:"BaSO₄ 是沉淀；Na⁺、Cl⁻ 是旁观离子，状态也不能写错。"},
        {id:"ionic-review-2",stem:"混合 NaCl(aq) 与 KNO₃(aq)，通常没有净离子反应。",options:["正确","不正确"],answer:0,why:"可能形成的 NaNO₃ 和 KCl 都易溶；没有沉淀、气体或弱电解质生成。"},
        {id:"ionic-review-3",stem:"AgNO₃(aq) 与 NaCl(aq) 混合，净离子式可写为 Ag⁺ + Cl⁻ → AgCl(s)。",options:["正确","不正确"],answer:0,why:"AgCl 是沉淀；Na⁺、NO₃⁻ 是旁观离子。"}
      ],
      source:"参考 2025 北京卷第 8、9 题与 2023 北京卷第 14 题的溶解性、难溶盐和沉淀条件考法；本单元练习为课程自编。"
    },
    {
      id:"redox", number:"04", title:"氧化还原", subtitle:"看化合价，也看电子去向", duration:"约 14 分钟", image:"redox", skill:"氧化还原判断",
      objective:"从化合价变化识别氧化还原，并说清氧化剂、还原剂。",
      prerequisite:"初中回顾：配平先保持原子数相等；原子团要结合具体反应判断是否整体变化。", prerequisiteCheck:{stem:"中性 Zn 原子变成 Zn²⁺，需要得到两个电子。",options:["正确","不正确"],answer:1,why:"Zn 失去两个带负电的电子后成为 Zn²⁺。"},
      remember:"必须记：化合价升高→失电子→被氧化；化合价降低→得电子→被还原。失电子的是还原剂，得电子的是氧化剂。",
      explanation:"初中从得氧、失氧识别，高中用化合价变化判断，再用电子转移解释。氧化与还原总是同时发生；反应物中得电子的一方是氧化剂，失电子的一方是还原剂。沉淀生成和复分解不自动意味着发生氧化还原。",
      positive:["Zn + Cu²⁺ → Zn²⁺ + Cu：Zn 失电子，Cu²⁺ 得电子。","2Na + Cl₂ → 2NaCl：Na 化合价升高，Cl 化合价降低。"],
      counterexample:["Ba²⁺ + SO₄²⁻ → BaSO₄(s)：没有化合价变化，不是氧化还原。","不含氧的反应也可以是氧化还原反应。"],
      activity:"沿原图看两条关系线：先标出化合价升降，再对应电子得失、被氧化/被还原和试剂角色。用 Zn + Cu²⁺ 与沉淀反应比较，确认分类判据是化合价是否改变。",
      practice:[
        {id:"redox-q1",skill:"氧化还原判断",role:"辨认规则",stem:"2Na + Cl₂ → 2NaCl 中，Na 与 Cl 的化合价变化，说明这是氧化还原反应。",options:["正确","不正确"],answer:0,point:"判断依据是化合价是否改变，不是反应物是否含氧。",why:"Na 从 0 变 +1，Cl 从 0 变 −1。",transfer:{stem:"Zn + Cu²⁺ → Zn²⁺ + Cu 不含氧，因此不是氧化还原反应。",answer:1,why:"Zn、Cu 的化合价发生变化；不含氧仍可发生氧化还原。"}},
        {id:"redox-q2",skill:"氧化还原角色",role:"解释与辨析",stem:"Zn + Cu²⁺ → Zn²⁺ + Cu 中，Cu²⁺ 得电子，因此 Cu²⁺ 是还原剂。",options:["正确","不正确"],answer:1,point:"试剂名称看它让别的物质发生什么；自身得失电子帮助判断。",why:"Cu²⁺ 得电子被还原，是氧化剂；Zn 失电子被氧化，是还原剂。",transfer:{stem:"反应中 Zn 失电子，Zn 是还原剂。",answer:0,why:"还原剂自身失电子并被氧化，使对方发生还原。"}},
        {id:"redox-q3",skill:"氧化还原边界",role:"迁移",stem:"BaCl₂(aq) 与 Na₂SO₄(aq) 生成 BaSO₄(s) 有沉淀，所以一定是氧化还原反应。",options:["正确","不正确"],answer:1,point:"反应现象与氧化还原分类使用不同判断标准。",why:"Ba、S、O 等元素的化合价没有变化；这是沉淀反应，不是氧化还原。",transfer:{stem:"CaO + H₂O → Ca(OH)₂ 中没有元素化合价变化。",answer:0,why:"虽为化合反应，但没有化合价改变，因此不是氧化还原反应。"}}
      ],
      reviewQuestions:[
        {id:"redox-review-1",stem:"Zn + Cu²⁺ → Zn²⁺ + Cu 中，Zn 失电子并被氧化，因此 Zn 是氧化剂。",options:["正确","不正确"],answer:1,why:"Zn 是还原剂；自身失电子、被氧化。Cu²⁺ 是氧化剂；自身得电子、被还原。"},
        {id:"redox-review-2",stem:"Zn + Cu²⁺ → Zn²⁺ + Cu 中，谁是氧化剂？",options:["Zn","Cu²⁺","都不是"],answer:1,why:"Cu²⁺ 得电子、化合价降低，被还原；它是氧化剂。"},
        {id:"redox-review-3",stem:"BaCl₂(aq) 与 Na₂SO₄(aq) 生成沉淀，因此该反应一定是氧化还原反应。",options:["正确","不正确"],answer:1,why:"形成沉淀不等同于氧化还原；该反应元素化合价没有变化。"}
      ],
      source:"使用人教版课程资源中的氧化还原关系图；本单元练习为课程自编。"
    }
  ],
  sources: [
    {label:"北京考试报：2025 年北京等级考化学试卷评析", url:"https://news.bjd.com.cn/2025/06/10/11194117.shtml"},
    {label:"教育部考试院高考评析索引", url:"https://www.neea.edu.cn/html1/folder/1510/811-3.htm"}
  ]
};
