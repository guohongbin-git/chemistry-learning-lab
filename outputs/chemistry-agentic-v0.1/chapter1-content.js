"use strict";

// These are original practice items, arranged by the textbook's first and third sections.
function caseItem(id, name, category, prompt, correct, key, explanation, terms) {
  return { id, name, category, kind: "statement", prompt, conducts: correct, carrier: key, explanation, terms };
}

const classification = [
  caseItem("class_air", "从空气开始", "分类 · 纯净物与混合物", "空气含氮气、氧气等，通常属于混合物。", true, "组成比例可变化", "正确。混合物由多种物质组成，空气的各成分比例也可能变化。", ["mixture","substance"]),
  caseItem("class_water", "蒸馏水是哪类", "分类 · 纯净物与混合物", "只含 H₂O 的理想纯水是混合物，因为 H₂O 分子里有氢、氧两种元素。", false, "一种物质可含多种元素", "错误。按物质种类分，只有 H₂O 的体系是纯净物；按元素组成分，H₂O 是化合物。", ["pure_substance","compound","water"]),
  caseItem("class_saltwater", "盐水能写成 NaCl 吗", "分类 · 边界", "NaCl 水溶液可用 NaCl 一个化学式表示其全部组成。", false, "NaCl 与 H₂O 共存", "错误。盐水是混合物；NaCl 是其中的溶质，H₂O 是溶剂。", ["mixture","nacl","aqueous_solution"]),
  caseItem("class_oxygen_ozone", "同素异形体", "分类 · 单质", "O₂ 和 O₃ 都只含氧元素，属于不同的氧单质。", true, "同种元素可形成不同单质", "正确。氧气和臭氧都是氧元素形成的单质，结构和性质不同，属于同素异形体。", ["elemental_substance","allotrope"]),
  caseItem("class_cu_o", "一种元素就一定是单质吗", "分类 · 易错边界", "O₂ 与 O₃ 混合后只含氧元素，所以这份混合气体也是单质。", false, "一类元素不等于一种物质", "错误。它含两种不同的单质，是混合物。判断单质要同时满足纯净物、只含一种元素。", ["elemental_substance","mixture","allotrope"]),
  caseItem("class_oxide", "氧化物怎样判", "分类 · 氧化物", "CO₂ 是由氧和另一种元素组成的化合物，属于氧化物。", true, "两种元素且其中一种是氧", "正确。氧化物是由两种元素组成，其中一种是氧元素的化合物。", ["oxide","compound"]),
  caseItem("class_acidic_oxide", "酸性氧化物", "分类 · 氧化物", "CO₂ 能与 NaOH 溶液反应生成盐和水，因此 CO₂ 是酸性氧化物。", true, "CO₂ + 2NaOH → Na₂CO₃ + H₂O", "正确。按是否能与碱反应生成盐和水判断。不能简单把所有非金属氧化物都视为酸性氧化物，例如 CO 不是。", ["acidic_oxide","oxide","base"]),
  caseItem("class_basic_oxide", "碱性氧化物", "分类 · 氧化物", "CuO 能与盐酸反应生成 CuCl₂ 和水，所以 CuO 属于碱性氧化物；这不意味着 CuO 能直接与水反应。", true, "CuO + 2HCl → CuCl₂ + H₂O", "正确。碱性氧化物能与酸反应生成盐和水；是否与水直接反应须另行判断。", ["basic_oxide","oxide","acid"]),
  caseItem("class_h2so4", "有氧就都是氧化物吗", "分类 · 反例", "H₂SO₄ 含氧元素，因此是氧化物。", false, "H、S、O 共三种元素", "错误。H₂SO₄ 含三种元素，按本课分类属于酸，不是氧化物。", ["oxide","acid","h2so4"]),
  caseItem("class_cross", "交叉分类", "分类 · 方法", "Na₂CO₃ 可以同时按阳离子归为钠盐，按阴离子归为碳酸盐。", true, "分类标准可以不同", "正确。同一物质可按不同属性进入不同类别；这叫交叉分类。", ["cross_classification","salt","na2co3"]),
  caseItem("class_tree", "树状分类", "分类 · 方法", "把物质先分纯净物与混合物，再把纯净物分单质与化合物，属于逐级细化的树状分类。", true, "每一级采用清楚的分类标准", "正确。树状分类逐级缩小范围；同一级分类标准要一致。", ["tree_classification","pure_substance","mixture"]),
  caseItem("class_solution", "溶液与分散系", "分散系 · 粒子", "食盐水是溶液；其中分散的 Na⁺、Cl⁻ 远小于胶体分散质粒子。", true, "按分散质粒子的尺度区分", "正确。分散系按分散质粒子大小可分溶液、胶体、浊液；尺度边界是模型，不等于每个样品尺寸整齐划一。", ["dispersion","solution","colloid"]),
  caseItem("class_milk", "乳浊液还是胶体", "分散系 · 边界", "所有白色液体都一定是胶体，可以只凭颜色判断。", false, "外观不能替代粒子尺度和实验", "错误。白色不构成胶体的定义；要看分散质粒子尺度及具体体系。牛奶是复杂分散体系，不宜仅凭颜色归类。", ["dispersion","colloid"]),
  caseItem("class_tyndall", "一束光里的证据", "胶体 · 丁达尔效应", "胶体粒子可使光散射，因此可见光路；这可辅助区分某些胶体和溶液。", true, "光被分散质粒子散射", "正确。丁达尔效应是胶体的常见性质，但要注意浓度、颜色、杂质等实验条件。", ["tyndall_effect","colloid","solution"]),
  caseItem("class_filter", "普通滤纸能筛出胶体粒子吗", "胶体 · 分离", "胶体分散质粒子通常不能靠普通滤纸与溶剂完全分开。", true, "胶体粒子通常可通过普通滤纸", "正确。普通滤纸常用于分离悬浊液中的较大颗粒；胶体净化可用渗析等方法。", ["colloid","dispersion"]),
  caseItem("class_ferric", "制备氢氧化铁胶体", "胶体 · 实验", "把少量饱和 FeCl₃ 溶液滴入沸水，继续煮沸至红褐色即停止加热，可制得 Fe(OH)₃ 胶体；直接把 FeCl₃ 与 NaOH 溶液混合通常得到沉淀。", true, "制备条件决定分散质状态", "正确。教材实验用沸水水解制胶体，颜色出现后停止加热；直接加碱常得到 Fe(OH)₃ 沉淀。", ["colloid","precipitate"]),
  caseItem("class_conversion", "氧化物到碱", "转化 · 反应路径", "CaO + H₂O → Ca(OH)₂ 表明某些金属氧化物可与水反应生成碱。", true, "反应物和产物类别发生改变", "正确。这里是具体例子，不能推广为所有金属氧化物都与水反应。", ["oxide","base","transformation"]),
  caseItem("class_conversion_false", "推论是否过度", "转化 · 高考迁移", "由 CaO 能与水反应可推出 CuO 也一定能与水直接生成 Cu(OH)₂。", false, "一个例子不能证明所有同类物质", "错误。CuO 通常不与水直接反应生成 Cu(OH)₂；判断转化要核对具体物质和条件。", ["oxide","transformation"]),
  caseItem("class_neutralization", "酸碱到盐", "转化 · 类型", "HCl + NaOH → NaCl + H₂O 可说明酸与碱经中和反应生成盐和水。", true, "酸和碱的具体反应", "正确。这是酸、碱、盐、水之间的转化例子；配平方程式后再判断类别。", ["acid","base","salt","transformation"])
];

const redox = [
  caseItem("redox_feo", "从初中得氧说起", "概念 · 扩展", "Fe₂O₃ + 3CO → 2Fe + 3CO₂ 中，CO 得氧被氧化；这个观察能引出氧化还原反应。", true, "CO 中碳的化合价 +2→+4", "正确。初中常用得氧失氧识别；高中用化合价变化和电子转移解释本质。", ["redox_reaction","oxidation_state"]),
  caseItem("redox_nakcl", "没有氧也可能发生", "概念 · 反例", "2Na + Cl₂ → 2NaCl 没有氧元素参与，所以不是氧化还原反应。", false, "Na 0→+1，Cl 0→−1", "错误。Na 失电子、Cl 得电子，化合价发生变化，是氧化还原反应。", ["redox_reaction","electron_transfer","oxidation_state"]),
  caseItem("redox_combination", "化合反应一定是氧化还原吗", "反应类型 · 边界", "CaO + H₂O → Ca(OH)₂ 是化合反应，但没有元素化合价变化，因此不是氧化还原反应。", true, "反应类型与电子转移是不同分类标准", "正确。四种基本反应类型与氧化还原分类可以交叉，不能仅凭‘化合反应’三个字判断。", ["redox_reaction","oxidation_state","transformation"]),
  caseItem("redox_displacement", "置换反应", "反应类型 · 交叉", "Zn + CuSO₄ → ZnSO₄ + Cu 中 Zn 0→+2、Cu +2→0，因此是氧化还原反应。", true, "Zn 失电子，Cu²⁺ 得电子", "正确。这个置换反应也是氧化还原反应；只看物质是否换位还不够，要核对化合价。", ["oxidation_state","redox_reaction"]),
  caseItem("redox_metathesis", "复分解反应", "反应类型 · 反例", "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl 中所有元素化合价不变，因此不是氧化还原反应。", true, "有沉淀生成，不一定有电子转移", "正确。离子重新组合形成沉淀，化合价不变。沉淀反应和氧化还原要分开判断。", ["redox_reaction","precipitate","oxidation_state"]),
  caseItem("redox_oxidation", "升高和失去", "电子转移 · 氧化", "在 Zn + Cu²⁺ → Zn²⁺ + Cu 中，Zn 化合价升高并失去电子，发生氧化反应。", true, "Zn → Zn²⁺ + 2e⁻", "正确。化合价升高对应失电子、被氧化。", ["oxidation","electron_transfer","oxidation_state"]),
  caseItem("redox_reduction", "降低和得到", "电子转移 · 还原", "同一反应中 Cu²⁺ 得到电子、化合价降低，发生还原反应。", true, "Cu²⁺ + 2e⁻ → Cu", "正确。得电子与化合价降低对应还原。氧化和还原同时发生。", ["reduction","electron_transfer","oxidation_state"]),
  caseItem("redox_agent", "谁是氧化剂", "四对概念 · 氧化剂", "Zn + Cu²⁺ → Zn²⁺ + Cu 中，Cu²⁺ 得电子，因此 Cu²⁺ 是氧化剂。", true, "氧化剂得电子、被还原", "正确。氧化剂使另一物质被氧化，自身得电子并被还原。", ["oxidizing_agent","reduction"]),
  caseItem("redox_agent_reverse", "谁是还原剂", "四对概念 · 还原剂", "同一反应中 Zn 失电子，因此 Zn 是氧化剂。", false, "还原剂失电子、被氧化", "错误。Zn 是还原剂，Cu²⁺ 才是氧化剂。区分‘剂’与自身经历的反应。", ["reducing_agent","oxidizing_agent","oxidation"]),
  caseItem("redox_products", "氧化产物与还原产物", "四对概念 · 产物", "Zn + Cu²⁺ → Zn²⁺ + Cu 中 Zn²⁺ 是氧化产物，Cu 是还原产物。", true, "追踪同一种元素的化合价前后", "正确。Zn 经氧化得到 Zn²⁺；Cu²⁺ 经还原得到 Cu。", ["oxidation_product","reduction_product"]),
  caseItem("redox_bridge", "电子转移数量", "表示方法 · 电子守恒", "Zn + Cu²⁺ → Zn²⁺ + Cu 中，Zn 失 2 个电子、Cu²⁺ 得 2 个电子，得失电子数相等。", true, "电子总数守恒", "正确。单线桥可标 Zn 向 Cu²⁺ 转移 2e⁻；双线桥分别表示化合价升降与得失电子。", ["electron_conservation","electron_bridge"]),
  caseItem("redox_bridge_wrong", "单线桥的箭头", "表示方法 · 易错", "Zn + Cu²⁺ → Zn²⁺ + Cu 的单线桥箭头应从 Cu²⁺ 指向 Zn，表示电子从氧化剂流向还原剂。", false, "电子从 Zn 到 Cu²⁺", "错误。单线桥从失电子的还原剂 Zn 指向得电子的氧化剂 Cu²⁺，标转移 2e⁻。", ["electron_bridge","reducing_agent","oxidizing_agent"]),
  caseItem("redox_cl2", "一边失一边得", "配平 · 电子守恒", "2Na + Cl₂ → 2NaCl 中，两个 Na 原子共失去 2e⁻，一个 Cl₂ 分子共得到 2e⁻。", true, "Na 0→+1 两次；Cl 0→−1 两次", "正确。先算每个原子的变化，再乘原子个数；得失电子总数相等。", ["electron_conservation","balancing"]),
  caseItem("redox_fecl3", "系数从何而来", "配平 · 高考迁移", "2FeCl₂ + Cl₂ → 2FeCl₃ 中，两份 Fe²⁺ 共失 2e⁻，一份 Cl₂ 共得 2e⁻，电子守恒。", true, "Fe +2→+3；Cl 0→−1", "正确。配平先找变价元素的得失电子数，再补其他元素并检查原子数。", ["electron_conservation","balancing"]),
  caseItem("redox_partial", "别只看一处守恒", "配平 · 易错边界", "FeCl₂ + Cl₂ → FeCl₃ 中只要 Fe 与 Cl 的化合价方向正确，这个式子就已经配平。", false, "左侧 Cl 为 4 个，右侧为 3 个", "错误。方向正确不等于方程式配平；正确系数是 2、1、2。", ["balancing","atom_conservation","electron_conservation"]),
  caseItem("redox_strength", "从反应判断强弱", "氧化性 · 条件推理", "若 Zn + Cu²⁺ → Zn²⁺ + Cu 能自发进行，可在该条件下判断 Cu²⁺ 的氧化性强于 Zn²⁺。", true, "氧化剂通常强于对应氧化产物", "正确。这是由已知可发生反应推出的定性比较；不能脱离题目条件任意排序所有物质。", ["oxidizing_agent","redox_reaction"]),
  caseItem("redox_strength_chain", "两条反应组成证据链", "氧化性 · 迁移", "已知同类条件下 Zn + Cu²⁺ → Zn²⁺ + Cu 和 Cu + 2Ag⁺ → Cu²⁺ + 2Ag 均能自发进行，可推断氧化性 Ag⁺＞Cu²⁺＞Zn²⁺。", true, "每条反应比较氧化剂与氧化产物", "正确。第一条给 Cu²⁺＞Zn²⁺，第二条给 Ag⁺＞Cu²⁺；只在给定条件下作定性推断。", ["oxidizing_agent","redox_reaction"]),
  caseItem("redox_pbs", "矿物焙烧中的变价", "综合 · 高考情境", "在示意反应 2PbS + 3O₂ → 2PbO + 2SO₂ 中，S 由 −2 升至 +4，被氧化；O 由 0 降至 −2，被还原。", true, "Pb 始终 +2；先找 S 和 O 的化合价变化", "正确。陌生矿物先标变价元素：S 失电子，O 得电子。此题为课程自编，借鉴浙江省教育考试院公布的 2024 年选考对 PbS 富氧煅烧和氧化还原的考法，不是原题。", ["redox_reaction","oxidation_state","oxidation","reduction"]),
  caseItem("redox_nochange", "最终判据", "综合 · 考法", "判断是否为氧化还原反应，应优先找元素化合价变化；电子转移是本质。", true, "宏观方程式与微观电子转移对应", "正确。高考常把陌生反应放进生活、实验情境，先找变价元素，再核对氧化剂、还原剂和得失电子数。", ["redox_reaction","oxidation_state","electron_transfer"])
];

const ionicExtra = [
  caseItem("ion_dissociation", "电离方程式", "电离 · 写式", "Na₂SO₄ 在水中电离可表示为 Na₂SO₄ → 2Na⁺ + SO₄²⁻。", true, "粒子种类、数目、电荷要对应", "正确。可溶性盐在水中形成自由移动离子；右侧总电荷为零，Na⁺ 前系数为 2。", ["dissociation","na2so4","charge_conservation"]),
  caseItem("ion_wrong_charge", "电离式也要查电荷", "电离 · 易错", "CaCl₂ → Ca⁺ + 2Cl⁻ 是正确的电离方程式。", false, "钙离子为 Ca²⁺", "错误。应写 CaCl₂ → Ca²⁺ + 2Cl⁻，两侧总电荷均为零。", ["dissociation","cacl2","charge_conservation"]),
  caseItem("ion_gas", "气体也是离子反应条件", "反应条件 · 气体", "Na₂CO₃(aq) 与稀盐酸反应产生 CO₂；净离子式可写 CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O。", true, "生成气体和水", "正确。除沉淀外，生成气体、水等弱电解质也能使离子反应发生。", ["ionic_reaction","carbonate_ion","acid"]),
  caseItem("ion_coexist_alkali", "碱性题干", "离子共存 · 隐含条件", "碱性溶液中大量 OH⁻ 与 H⁺ 可以大量共存，因为二者都带电。", false, "H⁺ + OH⁻ → H₂O", "错误。读到碱性先考虑 OH⁻；能反应生成水的 H⁺ 不能大量共存。", ["ionic_reaction","neutralization","hydroxide_ion"]),
  caseItem("ion_identify_cl", "离子检验要排干扰", "离子检验 · 证据", "向溶液加 AgNO₃ 有白色沉淀，就不加其他条件地断言原溶液必含 Cl⁻。", false, "要排除其他可与 Ag⁺ 形成沉淀的离子", "错误。检验 Cl⁻ 通常先用稀硝酸酸化，再加 AgNO₃；题目仍需关注其他干扰和操作顺序。", ["agcl","precipitate","chloride_ion"]),
  caseItem("ion_identify_sulfate", "检验硫酸根", "离子检验 · 排干扰", "检验 SO₄²⁻ 时，可先用稀盐酸酸化并确认无沉淀，再加 BaCl₂；出现不溶于酸的白色沉淀可支持存在 SO₄²⁻。", true, "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "正确。先酸化排除 CO₃²⁻ 等干扰，并注意原液中 Ag⁺ 等可能在加盐酸时形成沉淀；只凭一个白色沉淀不能跳过排干扰。", ["sulfate_ion","baso4","precipitate"]),
  caseItem("ion_dissociation_hcl", "酸的电离", "电离 · 对照", "HCl 气体与盐酸是同一种状态，所以 HCl(g) 和 HCl(aq) 均有大量自由移动的 H⁺、Cl⁻。", false, "(g) 与 (aq) 不同", "错误。HCl 气体主要是分子；形成盐酸后在水中电离。写式与解释导电时一定看状态。", ["hcl","hydrochloric_acid","dissociation"])
];

const conductivityExtra = [
  caseItem("conductivity_concentration", "导电强弱能只看名称吗", "导电能力 · 条件", "两份 NaCl 水溶液浓度、温度都未给出，只凭它们都叫 NaCl 溶液就能断定电导率相同。", false, "离子浓度和温度会影响测量", "错误。能否导电与导电强弱是不同问题；比较电导率须控制温度，并了解浓度等条件。", ["conductivity","concentration","nacl"]),
  caseItem("conductivity_reaction", "反应中电导率怎样变化", "导电能力 · 反应过程", "向 Ba(OH)₂ 溶液逐滴加入稀 H₂SO₄ 时，生成 BaSO₄ 沉淀和水；在适当的稀溶液及滴定条件下，电导率可先降至低点，继续加酸后再升高。", true, "可移动离子先被消耗，过量酸又带入离子", "正确。Ba²⁺、SO₄²⁻ 形成沉淀，H⁺、OH⁻ 形成水；过量酸提供离子。最低点不是严格零，也不能不看浓度和体积变化作定量结论。", ["conductivity","precipitate","neutralization"])
];

function term(id, name, category, definition, example, confusion, positive, negative) {
  return { term: { id, name, aliases: [], category, definition, example, confusion }, teaching: {
    memory: definition, worked: `${positive[0][0]}：${positive[0][1]}`, positive, negative
  } };
}
const newTerms = [
  term("pure_substance","纯净物","第一节 · 分类","只由一种物质组成的体系；可以是单质，也可以是化合物。","理想纯水和纯 NaCl。","一种物质可含多种元素；不要把纯净物误解成单质。",[["理想纯水","只含 H₂O"],["纯 NaCl 晶体","只含一种化合物"]],[["空气","含多种气体"],["盐水","含水和盐"]]),
  term("allotrope","同素异形体","第一节 · 分类","同一种元素形成的不同单质。","O₂ 与 O₃；金刚石与石墨。","两者混在一起属于混合物，不因只有一种元素就变成单质。",[["O₂ 与 O₃","均为氧元素形成的不同单质"],["金刚石与石墨","均为碳元素形成的不同单质"]],[["H₂O 与 H₂O₂","都是化合物"],["O₂ 与 N₂","元素不同"]]),
  term("oxide","氧化物","第一节 · 分类","由两种元素组成，其中一种是氧元素的化合物。","CaO、CO₂。","含氧不一定是氧化物；H₂SO₄ 有三种元素。",[["CaO","钙和氧两种元素"],["CO₂","碳和氧两种元素"]],[["H₂SO₄","含三种元素"],["O₂","是单质"]]),
  term("acidic_oxide","酸性氧化物","第一节 · 分类","能与碱反应生成盐和水的氧化物。","CO₂ 与 NaOH 反应。","多数非金属氧化物是酸性氧化物，但 CO 等是例外。",[["CO₂","与 NaOH 生成碳酸盐和水"],["SO₂","与 NaOH 生成亚硫酸盐和水"]],[["CO","不表现酸性氧化物性质"],["CaO","是碱性氧化物"]]),
  term("basic_oxide","碱性氧化物","第一节 · 分类","能与酸反应生成盐和水的氧化物。","CuO 与 HCl 反应。","碱性氧化物不一定能直接与水生成碱，CuO 是反例。",[["CuO","与 HCl 生成 CuCl₂ 和水"],["CaO","与酸反应生成钙盐和水"]],[["CO₂","是酸性氧化物"],["H₂SO₄","不是氧化物"]]),
  term("tree_classification","树状分类法","第一节 · 方法","按一个标准逐级划分，形成由大类到小类的层级。","物质→纯净物/混合物→单质/化合物。","同一层级的划分标准应一致。",[["物质→纯净物/混合物","先按物质种数"],["纯净物→单质/化合物","再按元素组成"]],[["把纯净物和酸并列为同级","层级不同"],["把金属和溶液并列为同级","标准混乱"]]),
  term("cross_classification","交叉分类法","第一节 · 方法","根据不同属性同时给同一对象归类。","Na₂CO₃ 既是钠盐，也是碳酸盐。","多标签不表示混合物；对象仍可能是纯净物。",[["Na₂CO₃","既是钠盐也是碳酸盐"],["Na₂SO₄","既是钠盐也是硫酸盐"]],[["NaCl 溶液是单一钠盐","溶液是混合物"],["只按一个标准逐级分叉","这是树状分类"]]),
  term("dispersion","分散系","第一节 · 分散系","一种或多种物质分散到另一种物质中形成的体系。","食盐水、Fe(OH)₃ 胶体、泥水。","分类看分散质粒子的尺度；外观相似不代表类别相同。",[["食盐水","离子分散在水中"],["泥水","较大固体粒子分散在水中"]],[["纯 NaCl 晶体","没有分散介质"],["理想纯水","只有一种物质"]]),
  term("solution","溶液","第一节 · 分散系","分散质以分子或离子等很小粒子均匀分散的分散系。","NaCl 水溶液和蔗糖水溶液。","溶液不一定有颜色，也不一定导电。",[["NaCl 水溶液","Na⁺ 与 Cl⁻ 分散在水中"],["蔗糖水溶液","蔗糖分子分散在水中"]],[["泥浆","较大颗粒易沉降"],["纯 NaCl 晶体","不是溶液"]]),
  term("colloid","胶体","第一节 · 分散系","分散质粒子直径通常在约 1–100 nm 的分散系。","Fe(OH)₃ 胶体。","胶体是分散系，不等同于一种固定化学物质；不能只凭颜色判断。",[["Fe(OH)₃ 胶体","教材常见实例"],["云雾","液滴分散在空气中，可作胶体实例"]],[["NaCl 水溶液","离子尺度更小"],["泥浆","颗粒通常更大"]]),
  term("tyndall_effect","丁达尔效应","第一节 · 胶体","光通过胶体时因粒子散射而显示光路的现象。","光束穿过 Fe(OH)₃ 胶体可见光路。","不是所有能看到光路的情境都可直接断定胶体，需排除尘埃等。",[["Fe(OH)₃ 胶体中的光路","胶体粒子散射"],["清晨薄雾中的光路","雾滴散射"]],[["理想纯水中无可见光路","分散粒子不足"],["只凭液体是红色","颜色不是丁达尔效应"]]),
  term("transformation","物质转化","第一节 · 转化","在一定条件下通过化学反应由一种物质生成另一种物质。","CaO + H₂O → Ca(OH)₂。","能否转化取决于具体反应条件，不是同类物质都能照搬。",[["CaO 加水生成 Ca(OH)₂","生成新物质"],["HCl 与 NaOH 中和","生成盐和水"]],[["NaCl 溶于水","主要是物理溶解"],["CuO 直接加水制 Cu(OH)₂","该反应通常不发生"]]),
  term("oxidation_state","化合价","第三节 · 基础","表示元素在化合物中形式电荷或成键电子归属的计数工具，可用于识别电子转移。","Zn 单质为 0，Zn²⁺ 为 +2。","化合价是形式计数，不能简单当作每个原子的真实电荷。",[["Zn：0→+2","化合价升高"],["Cu：+2→0","化合价降低"]],[["NaCl 中 Na 始终为 +1","没有变化"],["H₂O 中 O 始终为 −2","没有变化"]]),
  term("redox_reaction","氧化还原反应","第三节 · 核心","反应前后有元素化合价变化的化学反应；本质上有电子转移或偏移。","Zn + Cu²⁺ → Zn²⁺ + Cu。","不必含氧；产生沉淀也不必然是氧化还原。",[["2Na + Cl₂ → 2NaCl","Na、Cl 化合价改变"],["Zn + Cu²⁺ → Zn²⁺ + Cu","Zn、Cu 化合价改变"]],[["HCl + NaOH → NaCl + H₂O","化合价不变"],["Ba²⁺ + SO₄²⁻ → BaSO₄","化合价不变"]]),
  term("electron_transfer","电子转移","第三节 · 本质","氧化还原反应中电子失去与得到，或共用电子对偏移。","Zn 失去 2e⁻，Cu²⁺ 得到 2e⁻。","共价化合物中可表现为电子对偏移，不要求出现游离电子。",[["Zn 与 Cu²⁺ 反应","Zn 失、Cu²⁺ 得"],["Na 与 Cl₂ 反应","Na 失、Cl 得"]],[["NaCl 水溶液与 AgNO₃ 形成 AgCl","没有变价"],["HCl 与 NaOH 中和","没有电子转移"]]),
  term("oxidation","氧化反应","第三节 · 四对概念","元素化合价升高、对应失电子或电子对偏离的过程。","Zn → Zn²⁺。","被氧化的物质是还原剂，不是氧化剂。",[["Zn→Zn²⁺","失去电子"],["Fe²⁺→Fe³⁺","化合价升高"]],[["Cu²⁺→Cu","化合价降低"],["Cl₂→Cl⁻","得到电子"]]),
  term("reduction","还原反应","第三节 · 四对概念","元素化合价降低、对应得电子或电子对偏向的过程。","Cu²⁺ → Cu。","得电子的是氧化剂，自身被还原。",[["Cu²⁺→Cu","得到电子"],["Cl₂→Cl⁻","化合价降低"]],[["Zn→Zn²⁺","化合价升高"],["Fe²⁺→Fe³⁺","失去电子"]]),
  term("oxidizing_agent","氧化剂","第三节 · 四对概念","使别的物质被氧化，自身得电子并被还原的反应物。","Zn + Cu²⁺ 反应中的 Cu²⁺。","氧化剂自身发生还原反应。",[["Cu²⁺","从 +2 到 0，得电子"],["Cl₂","从 0 到 −1，得电子"]],[["Zn","失电子，是还原剂"],["Na","失电子，是还原剂"]]),
  term("reducing_agent","还原剂","第三节 · 四对概念","使别的物质被还原，自身失电子并被氧化的反应物。","Zn + Cu²⁺ 反应中的 Zn。","还原剂自身发生氧化反应。",[["Zn","从 0 到 +2，失电子"],["Na","从 0 到 +1，失电子"]],[["Cu²⁺","得电子，是氧化剂"],["Cl₂","得电子，是氧化剂"]]),
  term("oxidation_product","氧化产物","第三节 · 四对概念","还原剂发生氧化反应后生成的产物。","Zn + Cu²⁺ 反应中的 Zn²⁺。","从原反应物追踪变价元素，不要按产物名字猜。",[["Zn²⁺","由 Zn 氧化而来"],["Fe³⁺","由 Fe²⁺ 氧化而来"]],[["Cu","由 Cu²⁺ 还原而来"],["Cl⁻","由 Cl₂ 还原而来"]]),
  term("reduction_product","还原产物","第三节 · 四对概念","氧化剂发生还原反应后生成的产物。","Zn + Cu²⁺ 反应中的 Cu。","须追踪氧化剂对应元素。",[["Cu","由 Cu²⁺ 还原而来"],["Cl⁻","由 Cl₂ 还原而来"]],[["Zn²⁺","由 Zn 氧化而来"],["Fe³⁺","由 Fe²⁺ 氧化而来"]]),
  term("electron_conservation","得失电子守恒","第三节 · 配平","氧化还原反应中失去与得到的电子总数相等。","2Na + Cl₂ → 2NaCl，失与得均为 2e⁻。","要乘参与变价的原子个数；还要检查所有原子守恒。",[["Zn + Cu²⁺","得失均为 2e⁻"],["2Fe²⁺ + Cl₂","得失均为 2e⁻"]],[["Fe²⁺ + Cl₂ → Fe³⁺ + 2Cl⁻","电子数不等"],["只平电荷不查原子","验证不完整"]]),
  term("electron_bridge","电子转移表示法","第三节 · 表示","用单线桥或双线桥标出氧化还原反应中的电子转移及得失关系。","Zn + Cu²⁺ → Zn²⁺ + Cu 可标转移 2e⁻。","单线桥指电子从还原剂到氧化剂；双线桥分别连接同元素反应前后。",[["Zn→Cu²⁺ 标 2e⁻","单线桥电子方向正确"],["Zn 0→+2 标失 2e⁻","双线桥一侧"]],[["Cu²⁺→Zn 标 2e⁻","电子方向反了"],["把 Na⁺ 当游离电子","概念混淆"]])
];

const prerequisites = {
  classification: [
    {id:"class_element",title:"元素与物质",prompt:"H₂O 含氢、氧两种元素，它一定是混合物吗？",options:["一定是","不一定；纯 H₂O 是化合物"],answer:1,explanation:"元素种数与物质种数是两条分类轴。",bridge:"接下来会区分纯净物、混合物、单质和化合物。",termIds:["compound","mixture"],repair:{prompt:"纯 NaCl 晶体由几种物质组成？",options:["一种","两种"],answer:0,explanation:"纯 NaCl 只有一种化合物。"}},
    {id:"class_formula",title:"读化学式",prompt:"CO₂ 中右下角 2 表示什么？",options:["一个分子中有两个氧原子","两个 CO₂ 分子"],answer:0,explanation:"右下角下标表示组成中的原子数。",bridge:"用元素种数判断氧化物。",termIds:["chemical_formula","subscript"],repair:{prompt:"2CO₂ 前面的 2 表示什么？",options:["两个 CO₂","每个分子有两个 C"],answer:0,explanation:"前面的系数作用于整个化学式。"}},
    {id:"class_change",title:"物理变化与化学变化",prompt:"NaCl 溶于水主要是新物质生成吗？",options:["是","不是，主要是粒子分散"],answer:1,explanation:"溶解一般不等于化学反应。",bridge:"随后会判断物质之间的化学转化。",termIds:["dissolution","transformation"],repair:{prompt:"CaO + H₂O → Ca(OH)₂ 有新物质吗？",options:["有","没有"],answer:0,explanation:"生成 Ca(OH)₂，属于化学变化。"}}
  ],
  redox: [
    {id:"redox_atom",title:"原子和电子",prompt:"中性 Zn 原子变为 Zn²⁺，它怎样变化？",options:["失去两个电子","得到两个电子"],answer:0,explanation:"电子带负电，失去两个电子后带 +2 电荷。",bridge:"这是理解氧化与还原的起点。",termIds:["atom","ion","electron_transfer"],repair:{prompt:"Cu²⁺ 变为 Cu 原子要怎样？",options:["得到两个电子","失去两个电子"],answer:0,explanation:"得到负电电子，+2 电荷变为 0。"}},
    {id:"redox_valence",title:"化合价回顾",prompt:"单质 Zn 的化合价通常是多少？",options:["0","+2"],answer:0,explanation:"单质中元素化合价为 0。",bridge:"先比较反应前后的化合价，才能判断氧化还原。",termIds:["oxidation_state","elemental_substance"],repair:{prompt:"单质 Cl₂ 中 Cl 的化合价是多少？",options:["0","−1"],answer:0,explanation:"单质中元素化合价为 0。"}},
    {id:"redox_equation",title:"方程式守恒",prompt:"2Na + Cl₂ → 2NaCl 为什么 NaCl 前是 2？",options:["使 Na、Cl 原子数两侧相等","改变 NaCl 化学式"],answer:0,explanation:"配平只调整系数，不修改化学式下标。",bridge:"之后再加上得失电子数守恒。",termIds:["balancing","atom_conservation"],repair:{prompt:"配平时能把 NaCl 改成 NaCl₂ 吗？",options:["不能","可以"],answer:0,explanation:"下标决定物质组成，不能随意改。"}}
  ]
};

function asLesson(items) { return Object.fromEntries(items.map(item => [item.id, item])); }
module.exports = { classification: asLesson(classification), classificationPath: classification.map(item => item.id),
  redox: asLesson(redox), redoxPath: redox.map(item => item.id), ionicExtra: asLesson(ionicExtra), ionicExtraPath: ionicExtra.map(item => item.id),
  conductivityExtra: asLesson(conductivityExtra), conductivityExtraPath: conductivityExtra.map(item => item.id), newTerms, prerequisites };
