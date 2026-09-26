"use strict";

// Original Chapter 2 practice. `correct` and explanations are fixed course facts;
// the CLI tutor may discuss a learner's reasoning but cannot change the key.
function c(id,name,category,stage,prompt,correct,key,explanation,terms) {
  return {id,name,category,stage,kind:"statement",prompt,conducts:correct,carrier:key,explanation,terms};
}

const sodium = [
  c("na_outer","从原子结构预测","钠 · 原子",0,"钠原子最外层通常有 1 个电子，反应时容易失去它形成 Na⁺。",true,"Na → Na⁺ + e⁻","正确。由原子结构预测失电子倾向，再用反应事实检验；Na⁺ 与金属 Na 性质不同。",["ch2_sodium_metal","sodium_ion"]),
  c("na_ion_water","金属与离子别混淆","钠 · 正反例",0,"食盐水含 Na⁺，因此把金属钠投入水中与饮用食盐水没有区别。",false,"Na 单质会与水反应，Na⁺ 已失电子","错误。金属钠是活泼单质；食盐水中的 Na⁺ 是离子。不能把元素名称相同当成性质相同。",["ch2_sodium_metal","sodium_ion"]),
  c("na_storage","为什么隔绝空气","钠 · 保存",0,"金属钠通常保存在煤油中，是为了隔绝空气和水。",true,"钠易与氧气、水反应","正确。保存方法来自性质；取用和处置须由教师按实验规范完成。",["ch2_sodium_metal","ch2_sodium_storage"]),
  c("na_density","水面上的钠","钠 · 实验现象",1,"钠与水反应时浮在水面上，可支持钠的密度小于水。",true,"观察现象与物理性质对应","正确。浮、熔、游、响、红等现象要逐项解释；不能只背口诀。",["ch2_sodium_metal","ch2_na_water"]),
  c("na_water_eq","水反应的产物","钠 · 方程式",1,"2Na + 2H₂O → 2NaOH + H₂↑ 已配平，钠由 0 价升到 +1 价。",true,"Na 失电子，H₂O 中部分 H 得电子","正确。核对 Na、H、O 原子数与化合价；氢气来自水中的氢。",["ch2_na_water","redox_reaction"]),
  c("na_water_wrong","氢气从哪里来","钠 · 方程式反例",1,"钠与水反应产生的 H₂ 来自金属钠中原有的氢元素。",false,"钠单质只含 Na；氢来自 H₂O","错误。钠原子不含氢；反应前后元素守恒，H₂ 中的氢来自水。",["ch2_na_water","atom_conservation"]),
  c("na_litmus","碱性溶液的证据","钠 · 实验现象",1,"钠与水反应后滴加酚酞变红，支持生成了使溶液呈碱性的物质。",true,"生成 NaOH(aq)","正确。现象支持碱性；结合反应物和守恒判断产物是 NaOH。",["ch2_na_water","naoh"]),
  c("na_oxygen_room","常温与燃烧","钠 · 氧气",1,"钠在常温空气中与氧气反应，主要可形成氧化钠；不能据此断定燃烧时产物也相同。",true,"反应条件改变产物","正确。常温氧化与加热燃烧须分别描述，不能只凭反应物预测唯一产物。",["ch2_sodium_oxide","ch2_sodium_peroxide"]),
  c("na_oxygen_burn","燃烧产物","钠 · 氧气",1,"钠在氧气中燃烧可生成淡黄色 Na₂O₂，与常温氧化的主要产物 Na₂O 不同。",true,"2Na + O₂ → Na₂O₂","正确。Na₂O₂ 中氧为 −1 价；与 Na₂O 中氧为 −2 价不同。",["ch2_sodium_peroxide","ch2_sodium_oxide"]),
  c("na2o_water","普通氧化物","钠的氧化物 · 比较",2,"Na₂O 与水反应可生成 NaOH：Na₂O + H₂O → 2NaOH。",true,"钠的碱性氧化物","正确。Na₂O 可视作碱性氧化物；这与 Na₂O₂ 的水反应不同。",["ch2_sodium_oxide","basic_oxide"]),
  c("na2o2_oxygen","过氧化物中的氧","钠的氧化物 · 价态",2,"Na₂O₂ 中氧元素为 −1 价，所以不能把它与 Na₂O 当作同一种氧化物。",true,"Na₂O₂ 的过氧根 O₂²⁻ 中每个 O 为 −1","正确。先由 Na 为 +1、总电荷为零算氧的化合价，再比较组成与性质。",["ch2_sodium_peroxide","oxidation_state"]),
  c("na2o2_water","遇水放氧","钠的氧化物 · 水",2,"2Na₂O₂ + 2H₂O → 4NaOH + O₂↑；这里生成氧气。",true,"氧的 −1 价发生歧化","正确。系数、原子数都要核对；不能把 Na₂O₂ 的水反应套成 Na₂O 的水反应。",["ch2_sodium_peroxide","ch2_disproportionation"]),
  c("na2o2_co2","与二氧化碳","钠的氧化物 · 应用",2,"2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂；若 CO₂ 充足，氧气是产物之一。",true,"过氧化钠吸收 CO₂ 并放出 O₂","正确。Na₂CO₃ 与 O₂ 都是产物；这是供氧用途的化学依据。",["ch2_sodium_peroxide","ch2_sodium_carbonate"]),
  c("na2o2_not_na2o","类比的陷阱","钠的氧化物 · 反例",2,"因为 Na₂O 与 Na₂O₂ 都含钠和氧，它们与水反应的产物和电子变化完全相同。",false,"Na₂O₂ 额外放出 O₂，Na₂O 不会","错误。组成与氧价态不同，反应式不能互换。先配平，再追踪变价元素。",["ch2_sodium_oxide","ch2_sodium_peroxide"]),
  c("na2co3_name","苏打是什么","碳酸盐 · 认识",3,"纯碱/苏打的主要成分是 Na₂CO₃；虽然叫纯碱，它按组成仍是盐。",true,"Na₂CO₃ 是碳酸盐","正确。俗名不能替代组成分类；Na₂CO₃ 水溶液可呈碱性，但它不是 NaOH。",["ch2_sodium_carbonate","salt"]),
  c("nahco3_name","小苏打是什么","碳酸盐 · 认识",3,"小苏打 NaHCO₃ 与苏打 Na₂CO₃ 是不同化合物，不可把俗名混用。",true,"化学式分别为 NaHCO₃、Na₂CO₃","正确。碳酸氢根 HCO₃⁻ 与碳酸根 CO₃²⁻ 的组成、电荷不同。",["ch2_sodium_bicarbonate","ch2_sodium_carbonate"]),
  c("na2co3_acid","碳酸钠遇酸","碳酸盐 · 气体",3,"Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑；1 mol Na₂CO₃ 与足量酸可生成 1 mol CO₂。",true,"CO₃²⁻ + 2H⁺ → H₂O + CO₂","正确。由配平方程式看化学计量关系；反应是否完全取决于酸是否足量。",["ch2_sodium_carbonate","carbonate_ion"]),
  c("nahco3_acid","碳酸氢钠遇酸","碳酸盐 · 比较",3,"NaHCO₃ + HCl → NaCl + H₂O + CO₂↑；同为 1 mol 固体且酸足量时，它与 1 mol Na₂CO₃ 最终都可产生 1 mol CO₂。",true,"比较相同物质的量，不是相同质量","正确。两式每摩尔固体均产生 1 mol CO₂；若改为等质量，摩尔质量不同，结论会变。",["ch2_sodium_bicarbonate","ch2_sodium_carbonate"]),
  c("nahco3_heat","受热分解","碳酸盐 · 热稳定性",4,"2NaHCO₃ 加热可分解为 Na₂CO₃、CO₂ 和 H₂O。",true,"2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O","正确。用产气和守恒判断；Na₂CO₃ 在普通实验加热下较稳定。",["ch2_sodium_bicarbonate","ch2_sodium_carbonate"]),
  c("na2co3_heat","稳定性不能颠倒","碳酸盐 · 反例",4,"普通实验加热时 Na₂CO₃ 比 NaHCO₃ 更易分解放出 CO₂。",false,"NaHCO₃ 较易受热分解","错误。别把两者热稳定性记反；同条件下可用受热是否放 CO₂ 区分。",["ch2_sodium_bicarbonate","ch2_sodium_carbonate"])
];

const chlorine = [
  c("cl_atom","氯原子与氯离子","氯 · 粒子",0,"氯原子通常有 7 个最外层电子，得 1 个电子可形成 Cl⁻；Cl₂、Cl⁻ 和 HCl 不是同一种粒子。",true,"先区分原子、分子、离子","正确。化学式相近不能代替粒子类型与物质状态的判断。",["ch2_chlorine","chloride_ion"]),
  c("cl_seawater","海水中的氯","氯 · 来源",0,"海水中氯主要以 Cl₂ 分子存在，所以能直接用海水颜色判断氯气含量。",false,"海水中的氯主要是氯离子 Cl⁻","错误。海水中的氯主要以氯化物离子存在；氯气是另一种单质。",["ch2_chlorine","chloride_ion"]),
  c("cl2_property","氯气的基本性质","氯气 · 性质",0,"常温常压下 Cl₂ 是黄绿色、有刺激性气味的有毒气体；讨论用途时仍须说明安全条件。",true,"物理性质与安全性","正确。氯气可用于化工与消毒相关生产，但不能因有用途忽略毒性。",["ch2_chlorine_gas","ch2_chlorine"]),
  c("cl2_na","活泼金属与氯","氯气 · 反应",1,"2Na + Cl₂ → 2NaCl 中，Na 失电子，Cl₂ 得电子，属于氧化还原反应。",true,"Na 0→+1，Cl 0→−1","正确。由化合价和电子转移判断，而不是因为生成盐就排除氧化还原。",["ch2_chlorine_gas","redox_reaction"]),
  c("cl2_fe","铁与氯气","氯气 · 反应",1,"铁与足量 Cl₂ 反应生成 FeCl₃；不能把铁与稀盐酸生成 FeCl₂ 的结论直接照搬。",true,"2Fe + 3Cl₂ → 2FeCl₃","正确。反应物不同，氯气的氧化性使铁通常形成 +3 价产物。",["ch2_chlorine_gas","oxidizing_agent"]),
  c("cl2_h2","与氢气化合","氯气 · 反应",1,"H₂ + Cl₂ → 2HCl 中，产物 HCl 是化合物；若未溶于水，不应把气体直接叫盐酸。",true,"HCl(g) 与 HCl(aq) 的状态不同","正确。盐酸指 HCl 的水溶液；HCl 气体是化合物分子。",["ch2_chlorine_gas","hydrochloric_acid"]),
  c("cl2_water","氯水的粒子","氯水 · 水解",1,"Cl₂ 与水反应可表示为 Cl₂ + H₂O ⇌ HCl + HClO；新制氯水既有 Cl₂ 也有反应生成的粒子。",true,"可逆反应，溶液含多种成分","正确。不能把氯水简单看成纯 Cl₂ 或纯 HClO；只做定性成分分析。",["ch2_chlorine_water","ch2_hypochlorous_acid"]),
  c("cl2_water_false","氯水是纯净物吗","氯水 · 反例",1,"新制氯水只含 HClO 一种物质，因此属于纯净物。",false,"氯水含水、Cl₂、HCl、HClO 等","错误。氯水是混合物，不能只看其中一种有活性的成分。",["ch2_chlorine_water","mixture"]),
  c("cl2_disproportion","氯自己一升一降","氯水 · 氧化还原",2,"Cl₂ + H₂O ⇌ HCl + HClO 中，氯元素从 0 价分别到 −1 和 +1 价。",true,"同一元素既被氧化又被还原","正确。这是歧化反应；HCl 中 Cl 为 −1，HClO 中 Cl 为 +1。",["ch2_disproportionation","oxidation_state"]),
  c("hclo_bleach","湿纸与干纸","次氯酸 · 漂白",2,"新制氯水可使湿润有色纸褪色，主要与生成的 HClO 的氧化性有关；干燥 Cl₂ 不能直接套用同一结论。",true,"HClO 是主要漂白成分","正确。比较实验时要控制是否有水；不能把褪色机械归于 Cl₂ 分子本身。",["ch2_hypochlorous_acid","ch2_chlorine_water"]),
  c("hclo_weak","弱酸为何不全拆","次氯酸 · 电离",2,"HClO 是弱酸，写净离子方程式时通常保留 HClO 化学式，而不是完全拆成 H⁺ 与 ClO⁻。",true,"弱电解质不能按强酸完全拆写","正确。结合第一章“写、拆、删、查”；实际溶液有电离平衡，但净离子式中按弱酸处理。",["ch2_hypochlorous_acid","weak_electrolyte"]),
  c("hclo_light","见光分解","次氯酸 · 稳定性",2,"2HClO 在光照下可分解为 2HCl + O₂，因此氯水久置成分会改变。",true,"2HClO → 2HCl + O₂↑","正确。条件与保存时间影响溶液成分；不能把久置氯水当作新制氯水。",["ch2_hypochlorous_acid","ch2_chlorine_water"]),
  c("cl2_naoh","氯气与碱","含氯消毒剂 · 制备原理",3,"Cl₂ + 2NaOH → NaCl + NaClO + H₂O，产物同时含氯化物与次氯酸盐。",true,"一部分氯 −1，一部分 +1","正确。这是氯气在碱中歧化的例子；不要把 NaClO 写成 NaClO₂。",["ch2_hypochlorite","ch2_disproportionation"]),
  c("bleach84","84 的有效成分","含氯消毒剂 · 辨析",3,"84 消毒液的有效成分通常是 NaClO 水溶液中的次氯酸盐体系，而不是纯 Cl₂ 气体。",true,"NaClO 溶液而非纯氯气","正确。实际商品是混合物，使用浓度和条件以产品说明为准。",["ch2_hypochlorite","ch2_chlorine_water"]),
  c("bleach_acid","为什么不能混用","含氯消毒剂 · 安全",3,"84 消毒液与酸性洁厕剂混用可能放出有毒 Cl₂，因此不能混用。",true,"ClO⁻ + Cl⁻ + 2H⁺ → Cl₂↑ + H₂O","正确。危险来自不同成分在酸性条件下反应；这也是离子反应与氧化还原的迁移。",["ch2_hypochlorite","ch2_chlorine_gas"]),
  c("bleach_powder","漂白粉不是单一物质","含氯消毒剂 · 组成",3,"漂白粉是混合物，常以 Ca(ClO)₂ 等含氯物质为有效成分；不宜写成一个唯一化学式。",true,"商品与纯化合物要区分","正确。把混合物名称等同于单一化学式，是分类题常见陷阱。",["ch2_hypochlorite","mixture"]),
  c("cl_test","氯离子检验","氯离子 · 实验",4,"向待测液中加稀硝酸酸化，再加 AgNO₃ 出现不溶于稀硝酸的白色 AgCl 沉淀，可支持存在 Cl⁻。",true,"Ag⁺ + Cl⁻ → AgCl(s)","正确。酸化有助排除某些干扰；检验结论还要结合原溶液和试剂可能引入的离子。",["ch2_chloride_test","agcl"]),
  c("cl_test_hcl","试剂会引入目标离子","氯离子 · 反例",4,"检验未知溶液中的 Cl⁻ 时，先加盐酸酸化再加 AgNO₃ 得白色沉淀，就能证明原溶液含 Cl⁻。",false,"盐酸本身带入 Cl⁻","错误。盐酸提供 Cl⁻，会制造假阳性；应选择不引入待检离子的酸化方式。",["ch2_chloride_test","hydrochloric_acid"]),
  c("cl_lab_logic","制备题先读条件","氯气 · 实验推理",4,"已知 MnO₂ 与浓盐酸加热可制 Cl₂；分析装置时仍应检查杂质、收集方式和尾气处理，而非只背反应式。",true,"MnO₂ + 4HCl(浓) → MnCl₂ + Cl₂↑ + 2H₂O","正确。实验题还要核对气体有毒、湿度及反应条件；不可在无防护环境操作。",["ch2_chlorine_gas","ch2_chloride_test"]),
  c("cl2_solution","盐酸与氯水","氯气 · 综合",4,"盐酸 HCl(aq) 与新制氯水都含 Cl⁻，但新制氯水还可能含 Cl₂ 和 HClO，二者不能等同。",true,"相同离子不代表相同溶液组成","正确。比较混合物要列出主要粒子，再用性质和实验现象区分。",["ch2_chlorine_water","hydrochloric_acid"])
];

const mole = [
  c("mol_object","先说清计数对象","物质的量 · 对象",0,"说‘1 mol 氧’已足够明确，不必区分 O 原子、O₂ 分子或其他粒子。",false,"物质的量必须指明基本粒子","错误。1 mol O 原子与 1 mol O₂ 分子含不同的氧原子数；先说清计数对象。",["ch2_amount","ch2_mole"]),
  c("mol_not_mass","摩尔是什么单位","物质的量 · 单位",0,"mol 是物质的量的单位，不是质量单位；不同物质各取 1 mol 时质量可不同。",true,"物质的量与质量是不同物理量","正确。1 mol H₂O 与 1 mol CO₂ 粒子数相同，质量不同。",["ch2_amount","ch2_mole"]),
  c("mol_entities","摩尔与粒子数","物质的量 · 粒子",0,"1 mol 指约 6.02×10²³ 个指定基本粒子；计算前要注明粒子是分子、原子、离子还是化学式单位。",true,"1 mol 对应阿伏伽德罗常数个粒子","正确。摩尔让宏观量与微观粒子数联系起来；‘指定粒子’是关键。",["ch2_mole","ch2_avogadro"]),
  c("mol_nacl","离子晶体怎样计数","物质的量 · 粒子",0,"1 mol NaCl 晶体可说含 1 mol NaCl 化学式单位，也含 1 mol Na⁺ 和 1 mol Cl⁻。",true,"NaCl 的化学式单位中 Na:Cl=1:1","正确。离子晶体不由独立 NaCl 分子堆成；不要说 1 mol NaCl 分子。",["ch2_amount","nacl"]),
  c("mol_na","阿伏伽德罗常数的单位","粒子数 · 单位",1,"阿伏伽德罗常数 Nₐ 的单位是 mol⁻¹，N=nNₐ 的结果才是粒子个数。",true,"Nₐ≈6.02×10²³ mol⁻¹","正确。写 N 与 n 时别丢单位；N 是计数，n 的单位为 mol。",["ch2_avogadro","ch2_amount"]),
  c("mol_half_c","半摩尔碳原子","粒子数 · 基础算",1,"0.5 mol 碳原子约有 3.01×10²³ 个碳原子。",true,"0.5×6.02×10²³","正确。用 N=nNₐ，并保留计数对象‘碳原子’。",["ch2_avogadro","ch2_mole"]),
  c("mol_h2_atoms","分子数与原子数","粒子数 · 倍数",1,"1 mol H₂ 分子含 2 mol H 原子，所以氢原子总数约为 1.204×10²⁴ 个。",true,"每个 H₂ 分子有两个 H 原子","正确。先看化学式下标，再由分子数转原子数。",["ch2_avogadro","subscript"]),
  c("mol_water_atoms","水分子中的三颗原子","粒子数 · 倍数",1,"1 mol H₂O 分子共有 3 mol 原子，其中 H 原子 2 mol、O 原子 1 mol。",true,"每个 H₂O 分子含 2 H 与 1 O","正确。原子总数要把下标相加，不能把 1 mol 水直接当 1 mol 原子。",["ch2_avogadro","water"]),
  c("mol_na_ion","离子电荷不是个数","粒子数 · 反例",1,"1 mol Na⁺ 因为每个离子带 +1 电荷，所以共有 2 mol Na⁺ 离子。",false,"电荷数不改变粒子个数","错误。仍是 1 mol Na⁺；上标 +1 表示电荷，不是离子数。",["ch2_amount","sodium_ion"]),
  c("mol_mass_unit","摩尔质量单位","摩尔质量 · 单位",2,"H₂O 的相对分子质量为 18，摩尔质量约为 18 g·mol⁻¹；两者数值相同但单位不同。",true,"相对质量无量纲，M 有质量/物质的量单位","正确。不要把‘相对分子质量=摩尔质量’当成带单位的等式。",["ch2_molar_mass","ch2_amount"]),
  c("mol_co2_m","二氧化碳的 M","摩尔质量 · 计算",2,"CO₂ 的摩尔质量约为 44 g·mol⁻¹，所以 1 mol CO₂ 的质量约为 44 g。",true,"12+2×16=44","正确。先由化学式计算 M，再用 m=nM。",["ch2_molar_mass","ch2_amount"]),
  c("mol_h2o_mass","18 克水","摩尔质量 · 计算",2,"18 g H₂O 的物质的量约为 1 mol，因为 n=m/M，M(H₂O)≈18 g·mol⁻¹。",true,"18 g ÷18 g·mol⁻¹=1 mol","正确。式子中的单位相除后得到 mol。",["ch2_molar_mass","water"]),
  c("mol_o2_mass","8 克氧气","摩尔质量 · 计算",2,"8 g O₂ 为 0.25 mol O₂ 分子，因为 M(O₂)≈32 g·mol⁻¹。",true,"8/32=0.25","正确。不要把氧原子的相对原子质量 16 直接当 O₂ 的摩尔质量。",["ch2_molar_mass","ch2_mole"]),
  c("mol_nacl_mass","半摩尔食盐","摩尔质量 · 计算",2,"若 M(NaCl)≈58.5 g·mol⁻¹，0.5 mol NaCl 的质量约为 29.25 g。",true,"m=nM=0.5×58.5 g","正确。NaCl 以化学式单位计数，质量换算仍用摩尔质量。",["ch2_molar_mass","nacl"]),
  c("mol_co2_quarter","给质量求数量","摩尔质量 · 迁移",2,"0.2 mol CO₂ 的质量约为 8.8 g，同时含约 1.204×10²³ 个 CO₂ 分子。",true,"m=0.2×44；N=0.2Nₐ","正确。物质的量是质量与粒子数间的桥梁，两个结果分别核对单位。",["ch2_molar_mass","ch2_avogadro"]),
  c("mol_formula_wrong","下标和系数","计量关系 · 反例",3,"2H₂O 中前面的 2 表示每个水分子含 2 个氧原子。",false,"系数乘整个化学式，下标才写单个粒子组成","错误。2H₂O 表示 2 个水分子（或按量计为 2 mol 水分子）；每个 H₂O 只有 1 个 O。",["subscript","balancing"]),
  c("mol_stoich","按系数比换算","计量关系 · 水",3,"2H₂ + O₂ → 2H₂O 表示 2 mol H₂ 与 1 mol O₂ 恰好反应时生成 2 mol H₂O。",true,"配平方程式的系数给物质的量比","正确。还须有足量反应物与反应完全等条件，不能把系数直接当质量比。",["ch2_amount","chemical_equation"]),
  c("mol_stoich_mass","系数不是质量比","计量关系 · 反例",3,"2H₂ + O₂ → 2H₂O 的系数 2:1:2 表示三种物质的质量比也是 2:1:2。",false,"质量比须乘各自摩尔质量","错误。质量比为 4:32:36，可约成 1:8:9；系数给的是粒子数或物质的量比。",["ch2_amount","ch2_molar_mass"]),
  c("mol_gas_standard","气体摩尔体积有条件","气体体积 · 标准状况",3,"在约 0 ℃、101.325 kPa 的标准状况下，1 mol 理想气体体积约 22.4 L。",true,"Vₘ≈22.4 L·mol⁻¹ 只限指定条件","正确。先读温度、压强与气体状态；‘约’表示近似值。",["ch2_gas_molar_volume","ch2_standard_conditions"]),
  c("mol_gas_any","22.4 不是万能数","气体体积 · 反例",3,"不论温度和压强如何，1 mol 气体都恰好占 22.4 L。",false,"气体体积随条件变化","错误。22.4 L·mol⁻¹ 是特定标准状况下的常用近似值。",["ch2_gas_molar_volume","ch2_standard_conditions"]),
  c("mol_gas_half","半摩尔气体","气体体积 · 计算",4,"在上述标准状况下，11.2 L O₂ 约为 0.5 mol O₂ 分子。",true,"n=V/Vₘ≈11.2/22.4","正确。体积换算必须把题目条件与 Vₘ 的条件对齐。",["ch2_gas_molar_volume","ch2_standard_conditions"]),
  c("mol_gas_atoms","体积先到分子再到原子","气体体积 · 粒子",4,"标准状况下 22.4 L O₂ 约含 1 mol O₂ 分子、2 mol O 原子。",true,"每个 O₂ 分子含两个氧原子","正确。体积到物质的量，再由下标算氧原子数。",["ch2_gas_molar_volume","ch2_avogadro"]),
  c("mol_water_liquid","液体不能套气体公式","气体体积 · 反例",4,"标准状况下 1 mol 液态水也占约 22.4 L，因为它也由分子构成。",false,"22.4 L·mol⁻¹ 讨论的是气体","错误。物质的量相同不代表不同状态的体积相同；液态水不能套气体摩尔体积。",["ch2_gas_molar_volume","water"]),
  c("mol_gas_equal","同温同压等体积","气体体积 · 比较",4,"同温同压下，等体积的理想气体含相同数量的气体粒子，但质量不一定相同。",true,"V 与粒子数在同温同压下成正比","正确。不同气体分子的摩尔质量不同，等粒子数不等于等质量。",["ch2_gas_molar_volume","ch2_molar_mass"]),
  c("mol_room_temp","室温再核条件","气体体积 · 迁移",4,"若题目只说 25 ℃、常压，不能直接把气体摩尔体积当成标准状况的 22.4 L·mol⁻¹。",true,"25 ℃ 不是约 0 ℃","正确。先看温度、压强，再选择或计算适用的体积关系。",["ch2_gas_molar_volume","ch2_standard_conditions"])
];

const solutionPreparation = [
  c("conc_meaning","1 mol/L 的意思","浓度 · 概念",0,"1 mol·L⁻¹ NaCl 溶液指每 1 L 最终溶液含 1 mol NaCl，不是向 1 L 水中加入 1 mol NaCl。",true,"V 是最终溶液体积","正确。溶质加入后体积不一定等于原来溶剂体积。",["ch2_concentration","ch2_final_volume"]),
  c("conc_formula","浓度公式","浓度 · 计算",0,"c=n/V 中，若 n 用 mol、V 用 L，则 c 的单位是 mol·L⁻¹。",true,"物质的量除以最终溶液体积","正确。先换算单位；500 mL 要写为 0.500 L。",["ch2_concentration","ch2_final_volume"]),
  c("conc_half_litre","半升溶液","浓度 · 计算",0,"0.500 L 溶液中有 0.100 mol NaCl，物质的量浓度是 0.200 mol·L⁻¹。",true,"0.100/0.500=0.200","正确。体积取溶液最终体积，结果带单位。",["ch2_concentration","nacl"]),
  c("conc_mass","先算物质的量再称量","配制 · 计算",1,"配制 500 mL、0.200 mol·L⁻¹ NaCl 溶液，理论上需称 NaCl 约 5.85 g。",true,"n=cV=0.100 mol，m=nM≈5.85 g","正确。先把 500 mL 换成 0.500 L，再用 M(NaCl)≈58.5 g·mol⁻¹。",["ch2_concentration","ch2_molar_mass"]),
  c("conc_flask","容量瓶测什么","配制 · 仪器",1,"500 mL 容量瓶用于按刻度配制规定最终体积的溶液，不宜直接用来溶解固体或加热。",true,"容量瓶有标定容积与使用温度","正确。先在烧杯中溶解，冷却后转入容量瓶；容量瓶不能加热。",["ch2_volumetric_flask","ch2_final_volume"]),
  c("conc_dissolve","先在烧杯溶解","配制 · 步骤",1,"称取固体后先在烧杯中用适量水溶解，再移入容量瓶定容。",true,"溶解与定容使用不同仪器","正确。应避免把固体直接放入容量瓶；随后要定量转移。",["ch2_volumetric_flask","ch2_solution_steps"]),
  c("conc_cool","热溶液不能马上定容","配制 · 温度",2,"溶解放热后，应待溶液冷却至室温，再转移并定容。",true,"体积随温度变化，容量瓶按标定温度使用","正确。热溶液直接按刻度定容后冷却，最终体积可能偏小；不能忽略温度。",["ch2_solution_steps","ch2_volumetric_flask"]),
  c("conc_rinse","洗涤为什么倒进去","配制 · 定量转移",2,"烧杯和玻璃棒上的残留溶质应以少量水洗涤并合并入容量瓶，以减少溶质损失。",true,"保证目标溶质物质的量进入容量瓶","正确。洗涤液也要进入容量瓶；只加水不会改变最终定容体积。",["ch2_solution_steps","ch2_transfer_loss"]),
  c("conc_rinse_false","洗涤水会稀释吗","配制 · 反例",2,"洗涤液倒入容量瓶后，只要仍按刻度定容，必然使最终溶液浓度偏低。",false,"最终体积仍是容量瓶标定值","错误。洗涤使溶质转移更完全；后续到刻度的最终体积不变。",["ch2_solution_steps","ch2_final_volume"]),
  c("conc_meniscus","眼睛与凹液面","配制 · 定容",3,"定容时视线应与凹液面最低处水平；接近刻度线时逐滴加水。",true,"减少读数与过线误差","正确。仰视或俯视都可能改变实际定容体积，不能只记‘看刻度’。",["ch2_volumetric_flask","ch2_solution_steps"]),
  c("conc_overfill","超过刻度线","配制 · 误差",3,"若定容时水加过刻度线且没有重新配制，最终体积偏大、溶质物质的量近似不变，浓度偏低。",true,"c=n/V，V 偏大","正确。不能靠吸出少量溶液恢复原配制结果，因为会连同溶质一起移走。",["ch2_error_direction","ch2_final_volume"]),
  c("conc_loss","转移中洒出溶液","配制 · 误差",3,"若转移时有部分含溶质液体洒在外面，最终仍定容到刻度，配得溶液浓度偏低。",true,"进入容量瓶的 n 偏小，V 不变","正确。用 c=n/V 分析：溶质损失导致 n 偏小。",["ch2_error_direction","ch2_transfer_loss"]),
  c("conc_hot","冷却前定容的方向","配制 · 误差",4,"假设溶液受热膨胀且无挥发损失，热时定容到刻度后冷却，最终体积变小，浓度可能偏高。",true,"温度下降使实际体积缩小，n 近似不变","正确。先声明‘受热膨胀、无损失’前提，不能把所有热溶液误差一概而论。",["ch2_error_direction","ch2_solution_steps"]),
  c("conc_shake","摇匀后的液面","配制 · 完成",4,"定容塞紧并摇匀后液面可能暂时低于刻度；仅凭这一点再加水，会破坏已配好的浓度。",true,"瓶壁挂液等可改变观察到的液面","正确。按规范定容并摇匀后不因液面暂低就补水。",["ch2_solution_steps","ch2_volumetric_flask"]),
  c("conc_dilution","稀释守恒","浓度 · 迁移",4,"只加水且无溶质损失时，稀释前后溶质物质的量不变，可用 c₁V₁=c₂V₂ 计算。",true,"n 前=n 后","正确。体积、浓度须配套单位；发生反应或有损失时不能直接套用。",["ch2_concentration","ch2_final_volume"])
];

function t(id,name,category,definition,positive,negative,confusion="先核对物质、状态和题目条件。") {
  return {term:{id,name,aliases:[],category,definition,example:positive[0][0],confusion},
    teaching:{memory:definition,worked:`${positive[0][0]}：${positive[0][1]}`,positive,negative}};
}
const newTerms = [
  t("ch2_sodium_metal","金属钠","第二章 · 代表物质","Na 单质是活泼金属，原子易失电子形成 Na⁺。",[["Na 金属块","由钠单质组成"],["Na 与水反应前的钠","化合价为 0"]],[["食盐水中的 Na⁺","已是离子"],["Na₂CO₃ 中的钠","属于化合物组成"]],"金属钠不等于食品中的钠离子。"),
  t("ch2_sodium_storage","钠的保存","第二章 · 实验词汇","金属钠通常浸没在煤油中，以隔绝空气和水。",[["钠浸在煤油中","隔绝反应物"],["密闭且合规保存","减少接触空气和水"]],[["钠暴露在潮湿空气中","易反应"],["把钠放入水中保存","会剧烈反应"]],"实验操作须由教师按规范完成。"),
  t("ch2_na_water","钠与水的反应","第二章 · 核心反应","2Na + 2H₂O → 2NaOH + H₂↑；Na 失电子，水中部分 H 得电子。",[["Na 与水","生成 NaOH 和 H₂"],["反应后溶液呈碱性","与 NaOH 生成一致"]],[["H₂ 来自 Na 内部","Na 不含 H"],["反应生成 O₂","本反应的气体是 H₂"]]),
  t("ch2_sodium_oxide","氧化钠 Na₂O","第二章 · 代表物质","Na₂O 中 O 为 −2 价，是钠的碱性氧化物，可与水生成 NaOH。",[["Na₂O + H₂O","生成 2NaOH"],["Na₂O 中的 O","化合价 −2"]],[["Na₂O₂","O 为 −1 价，属过氧化物"],["NaOH","是碱而非氧化物"]]),
  t("ch2_sodium_peroxide","过氧化钠 Na₂O₂","第二章 · 代表物质","Na₂O₂ 是淡黄色过氧化物，O 为 −1 价；与水或 CO₂ 反应可放出 O₂。",[["Na₂O₂ 与水","生成 NaOH、O₂"],["Na₂O₂ 与 CO₂","生成 Na₂CO₃、O₂"]],[["Na₂O","普通氧化钠，氧为 −2"],["NaOH","不含过氧根"]],"不要把它按 Na₂O 的反应式套算。"),
  t("ch2_sodium_carbonate","碳酸钠 Na₂CO₃","第二章 · 代表物质","Na₂CO₃ 是钠盐，俗称苏打、纯碱；水溶液可呈碱性。",[["纯碱","主要指 Na₂CO₃"],["Na₂CO₃ 与酸","可放出 CO₂"]],[["小苏打","NaHCO₃"],["NaOH","真正的氢氧化钠碱"]],"俗称中的‘碱’不改变它是盐的组成分类。"),
  t("ch2_sodium_bicarbonate","碳酸氢钠 NaHCO₃","第二章 · 代表物质","NaHCO₃ 是碳酸氢盐，俗称小苏打；受热可分解。",[["小苏打","NaHCO₃"],["加热 NaHCO₃","生成 Na₂CO₃、CO₂、H₂O"]],[["苏打","Na₂CO₃"],["NaCl","不含 HCO₃⁻"]],"同为 1 mol 与等质量比较，产气结论可能不同。"),
  t("ch2_chlorine","氯元素与氯离子","第二章 · 核心概念","氯元素可存在于 Cl₂、Cl⁻、HClO 等不同粒子或物质中。",[["Cl₂","氯单质中的氯"],["Cl⁻","氯化物离子中的氯"]],[["把 Cl₂ 等同 Cl⁻","粒子类别不同"],["把 HClO 等同盐酸","组成不同"]],"同一元素不能代表相同性质。"),
  t("ch2_chlorine_gas","氯气 Cl₂","第二章 · 代表物质","Cl₂ 是黄绿色有毒气体，常表现氧化性，使用需严格控制安全条件。",[["纯 Cl₂ 气体","氯元素单质"],["Cl₂ 与 Fe","可生成 FeCl₃"]],[["海水中的 Cl⁻","离子而非氯气"],["盐酸","HCl 水溶液而非 Cl₂"]]),
  t("ch2_chlorine_water","氯水","第二章 · 混合物","氯气溶于水形成的混合溶液；新制时含 Cl₂、HClO、HCl 等成分。",[["新制氯水","含水与多种含氯粒子"],["久置氯水","成分可能因 HClO 分解而变化"]],[["纯 Cl₂","单质而非溶液"],["纯 HClO","单一化合物"]],"新制与久置不能当成同一组成。"),
  t("ch2_hypochlorous_acid","次氯酸 HClO","第二章 · 核心概念","HClO 是弱酸，具有氧化性且不稳定；是氯水漂白的重要成分。",[["湿润有色纸褪色","可与生成的 HClO 有关"],["HClO 光照分解","说明其不稳定"]],[["HCl","盐酸中的强酸成分"],["干燥 Cl₂ 直接漂白","没有水不能照搬氯水结论"]]),
  t("ch2_disproportionation","歧化反应","第二章 · 核心概念","同一元素在同一反应中化合价一部分升高、一部分降低的氧化还原反应。",[["Cl₂ 与水","Cl 从 0 到 −1、+1"],["Cl₂ 与 NaOH","生成 Cl⁻、ClO⁻"]],[["Na 与水","Na 只升价"],["Ag⁺ 与 Cl⁻ 沉淀","没有化合价变化"]]),
  t("ch2_hypochlorite","次氯酸盐","第二章 · 代表物质","含 ClO⁻ 的盐，如 NaClO、Ca(ClO)₂；相关水溶液可用于消毒。",[["NaClO","含 ClO⁻"],["Ca(ClO)₂","含 ClO⁻"]],[["NaCl","只含 Cl⁻"],["HClO","是弱酸，不是盐"]],"商品消毒液是混合物，不是纯 NaClO。"),
  t("ch2_chloride_test","氯离子检验","第二章 · 实验词汇","在适当酸化条件下，Cl⁻ 与 Ag⁺ 生成不溶于稀硝酸的白色 AgCl 沉淀。",[["硝酸酸化后加 AgNO₃","白色 AgCl 支持 Cl⁻"],["Ag⁺ + Cl⁻","形成 AgCl(s)"]],[["先加盐酸再检验","试剂引入 Cl⁻"],["只看白色便下结论","其他干扰尚未排除"]]),
  t("ch2_amount","物质的量 n","第二章 · 核心概念","表示指定基本粒子数多少的物理量，单位是 mol。",[["1 mol H₂O 分子","指明分子"],["0.5 mol Na⁺","指明离子"]],[["1 mol 氧","对象不明确"],["把 n 当质量","物理量不同"]],"必须注明分子、原子、离子或化学式单位。"),
  t("ch2_mole","摩尔 mol","第二章 · 核心概念","物质的量的 SI 单位；1 mol 含阿伏伽德罗常数个指定基本粒子。",[["1 mol CO₂ 分子","粒子数约 6.02×10²³"],["1 mol Cl⁻","粒子数约 6.02×10²³"]],[["1 mol=1 g","摩尔不是质量单位"],["1 mol=1 L","摩尔不是体积单位"]]),
  t("ch2_avogadro","阿伏伽德罗常数 Nₐ","第二章 · 核心概念","Nₐ=6.02214076×10²³ mol⁻¹；高中计算常取约 6.02×10²³ mol⁻¹。",[["N=nNₐ","由 mol 到粒子数"],["0.5 mol 原子","约 3.01×10²³ 个"]],[["把 Nₐ 写成 g/mol","单位错误"],["把 1 mol H₂ 当 1 mol H 原子","忽略下标"]]),
  t("ch2_molar_mass","摩尔质量 M","第二章 · 核心概念","单位物质的量的物质所具有的质量，常用单位 g·mol⁻¹。",[["M(H₂O)≈18 g·mol⁻¹","1 mol 质量约 18 g"],["M(O₂)≈32 g·mol⁻¹","双原子分子"]],[["H₂O 相对分子质量=18 g/mol","相对分子质量无量纲"],["把 O₂ 的 M 取 16","漏了下标 2"]]),
  t("ch2_gas_molar_volume","气体摩尔体积 Vₘ","第二章 · 核心概念","在指定温度、压强下，单位物质的量气体的体积，Vₘ=V/n。",[["标准状况理想气体","约 22.4 L·mol⁻¹"],["同温同压比较","体积与粒子数成正比"]],[["任何条件都 22.4","忽略温压"],["液态水也套 22.4","状态不符"]]),
  t("ch2_standard_conditions","标准状况","第二章 · 条件词","本课指约 0 ℃、101.325 kPa；此时常用理想气体摩尔体积约 22.4 L·mol⁻¹。",[["0 ℃、101.325 kPa","本课标况"],["标况 1 mol O₂","体积约 22.4 L"]],[["25 ℃、常压","不是本课标况"],["未给条件便用 22.4","缺适用条件"]]),
  t("ch2_concentration","物质的量浓度 c","第二章 · 核心概念","单位体积最终溶液中所含溶质的物质的量，c=n/V。",[["0.1 mol 在 0.5 L 溶液","c=0.2 mol·L⁻¹"],["稀释前后 n 不变","可用 c₁V₁=c₂V₂"]],[["以溶剂水体积算 V","体积对象错"],["V 用 mL 不换算","单位不配套"]]),
  t("ch2_final_volume","最终溶液体积","第二章 · 条件词","浓度公式和容量瓶刻度中的 V 指配制完成后的整个溶液体积。",[["定容到 500 mL","最终溶液为 500 mL"],["c=n/V","V 是溶液体积"]],[["先量 500 mL 水再加盐","最终溶液体积未必 500 mL"],["只看烧杯里的水","不是最后定容体积"]]),
  t("ch2_volumetric_flask","容量瓶","第二章 · 实验词汇","按标定温度和刻度配制准确最终体积溶液的仪器，不能直接加热或溶解固体。",[["500 mL 容量瓶","按刻度定容"],["冷却后转移溶液","符合使用顺序"]],[["在容量瓶中加热","不合规范"],["直接放固体溶解","不合规范"]]),
  t("ch2_solution_steps","配液操作顺序","第二章 · 实验词汇","计算、称量、溶解、冷却、转移、洗涤、定容、摇匀；定容体积是最终溶液体积。",[["洗涤液并入容量瓶","减少溶质损失"],["接近刻度逐滴加水","便于准确定容"]],[["热时直接定容","温度影响体积"],["超过刻度再吸出","不能恢复原组成"]]),
  t("ch2_transfer_loss","转移损失","第二章 · 误差词汇","配液时部分溶质未进入容量瓶，若仍定容到目标体积，浓度偏低。",[["含溶质液体洒出","n 变小"],["烧杯残液未洗入","n 变小"]],[["只加入洗涤水并定容","n 未减少"],["定容过线","主要是 V 变大"]]),
  t("ch2_error_direction","配液误差分析","第二章 · 方法词汇","用 c=n/V 分别判断进入容量瓶的溶质 n 与最终体积 V 如何变化，再确定偏高或偏低。",[["转移损失","n↓，c↓"],["定容过线","V↑，c↓"]],[["不说明条件便说加水都偏低","最终是否过线需判断"],["把摇匀后的液面低当成必须补水","会额外加水"]])
];

function p(id,title,prompt,options,answer,explanation,bridge,termIds,repairPrompt,repairOptions,repairAnswer,repairExplanation) {
  return {id,title,prompt,options,answer,explanation,bridge,termIds,
    repair:{prompt:repairPrompt,options:repairOptions,answer:repairAnswer,explanation:repairExplanation}};
}
const prerequisites = {
  sodium:[
    p("na_electron","原子与离子","中性 Na 原子失去 1 个电子后，电荷怎样变化？",["变为 +1","变为 −1"],0,"失去带负电的电子，形成 Na⁺。","接着分析金属钠为什么活泼。",["ch2_sodium_metal","sodium_ion"],"Na⁺ 得回 1 个电子会怎样？",["变成中性 Na 原子","变成 Na²⁺"],0,"得到一个负电电子，+1 变为 0。"),
    p("na_redox","化合价回顾","Na 单质中的 Na 化合价通常是多少？",["0","+1"],0,"单质中元素化合价为 0。","后面比较 Na₂O 与 Na₂O₂ 的氧价态。",["oxidation_state","ch2_sodium_oxide"],"NaCl 中的 Na 通常是多少价？",["+1","0"],0,"NaCl 中 Na 为 +1。"),
    p("na_carbonate","酸和碳酸盐","碳酸盐遇足量稀盐酸常放出哪种气体？",["CO₂","H₂"],0,"碳酸根与酸反应可产生 CO₂。","这能帮你比较苏打与小苏打。",["carbonate_ion","ch2_sodium_carbonate"],"CaCO₃ 遇盐酸的气体是什么？",["CO₂","O₂"],0,"碳酸盐与酸反应的典型气体是 CO₂。")
  ],
  chlorine:[
    p("cl_atom_ion","原子、离子、分子","Cl⁻ 与 Cl₂ 是同一种粒子吗？",["不是","是"],0,"前者是离子，后者是双原子分子。","进入氯及其化合物前先分清粒子身份。",["ch2_chlorine","chloride_ion"],"Na⁺ 与金属 Na 是同一种粒子吗？",["不是","是"],0,"离子与单质不能混同。"),
    p("cl_valence","化合价迁移","Cl₂ 单质中 Cl 元素化合价为多少？",["0","−1"],0,"单质中元素价态为 0。","氯气与水反应时一部分升、一部分降。",["oxidation_state","ch2_disproportionation"],"NaCl 中 Cl 的常见化合价是？",["−1","0"],0,"Na 为 +1，Cl 为 −1。"),
    p("cl_reaction","检验不是只看颜色","Ag⁺ 与 Cl⁻ 结合常出现什么？",["白色 AgCl 沉淀","蓝色溶液"],0,"AgCl 是常见难溶白色沉淀。","后面还要检查酸化试剂是否引入 Cl⁻。",["agcl","ch2_chloride_test"],"硝酸盐通常溶于水吗？",["通常可溶","通常都难溶"],0,"常见硝酸盐通常可溶。")
  ],
  mole:[
    p("mol_formula","读化学式","一个 H₂O 分子含几个氢原子？",["2 个","1 个"],0,"右下角 2 表示一个分子的氢原子数。","接下来会从分子数换算原子数。",["subscript","water"],"一个 CO₂ 分子含几个氧原子？",["2 个","1 个"],0,"下标 2 作用于 O。"),
    p("mol_mass","质量单位","18 g 与 18 kg 是同一个质量吗？",["不是","是"],0,"1 kg=1000 g。","摩尔质量运算时必须带单位。",["ch2_molar_mass","ch2_mole"],"0.5 kg 是多少克？",["500 g","50 g"],0,"0.5×1000=500。"),
    p("mol_coeff","配平系数","2H₂ + O₂ → 2H₂O 中 H₂ 前面的 2 作用于整分子吗？",["是","不是"],0,"系数乘整个化学式。","系数也能表示物质的量比。",["balancing","chemical_equation"],"2CO₂ 表示两个 CO₂ 分子吗？",["是","不是"],0,"系数 2 作用于整个 CO₂。")
  ],
  solution_preparation:[
    p("conc_fraction","初中浓度回顾","把 5 g NaCl 加入 95 g 水，溶质质量分数是多少？",["5%","约 5.26%"],0,"溶液总质量 100 g，5/100=5%。","新浓度单位将改用 mol·L⁻¹。",["ch2_concentration","ch2_final_volume"],"10 g 盐加入 90 g 水，质量分数是？",["10%","约 11.1%"],0,"溶液总质量是 100 g。"),
    p("conc_volume","单位换算","500 mL 等于多少 L？",["0.500 L","5 L"],0,"1000 mL=1 L。","用 c=n/V 时先换算到 L。",["ch2_final_volume","ch2_concentration"],"250 mL 等于多少 L？",["0.250 L","2.5 L"],0,"250/1000=0.250。"),
    p("conc_reading","刻度读数","读量筒或容量瓶液面时，视线应与凹液面最低处水平吗？",["应当","不用"],0,"视线水平可减少视差。","定容的体积误差会直接影响浓度。",["ch2_volumetric_flask","ch2_solution_steps"],"俯视刻度与平视一样可靠吗？",["不一样","一样"],0,"俯视会产生视差。")
  ]
};

function lesson(id,title,description,rule,recall,cases,repairPath,tutorRules) {
  return {id,title,description,rule,recall,cases:Object.fromEntries(cases.map(item=>[item.id,item])),
    corePath:cases.map(item=>item.id),repairPath,tutorRules,chapter:2};
}
const lessons = {
  sodium:lesson("sodium","第一节 · 钠及其化合物","从原子结构预测金属钠，再用实验事实比较 Na₂O、Na₂O₂、Na₂CO₃ 与 NaHCO₃。",
    "先看钠的原子结构和失电子，再读反应条件。常温氧化与燃烧的产物不同；Na₂O 中氧 −2 价，Na₂O₂ 中氧 −1 价。碳酸钠和碳酸氢钠要从化学式、与酸反应、热稳定性三个维度比较。",
    "不看答案写钠与水、过氧化钠与水、碳酸氢钠受热的方程式；再解释苏打与小苏打如何区分。",sodium,{na_water_wrong:"na_water_eq",na2o2_not_na2o:"na2o2_water",na2co3_heat:"nahco3_heat"},
    "本节只讨论教材常见条件。金属 Na 与 Na⁺ 不可混淆。Na₂O 与 Na₂O₂ 的氧价态和反应不同；Na₂O₂ 与水或 CO₂ 反应可放 O₂。Na₂CO₃ 是盐，俗称纯碱；NaHCO₃ 小苏打受热分解。配平并说明实验安全，不给学生实际操作指令。"),
  chlorine:lesson("chlorine","第二节 · 氯及其化合物","区分海水中的 Cl⁻ 与氯气，理解氯气反应、氯水、次氯酸、消毒剂和氯离子检验。",
    "先分清 Cl₂、Cl⁻、HCl(aq)。氯气与水形成 HCl 和 HClO；新制氯水是混合物，HClO 有氧化性且不稳定。含氯消毒剂与酸性清洁剂不能混用；检验 Cl⁻ 时不能用盐酸引入待检离子。",
    "不看答案解释湿纸比干纸更易被新制氯水漂白；写 Cl₂ 与水、NaOH 的反应；说明为何检验 Cl⁻ 不先加盐酸。",chlorine,{cl_seawater:"cl_atom",cl2_water_false:"cl2_water",cl_test_hcl:"cl_test"},
    "氯的价态与粒子类别必须分清。Cl₂+H₂O⇌HCl+HClO，氯水是混合物；漂白主要与 HClO 氧化性有关。84 消毒液主要含 NaClO，不能与酸性洁厕剂混用。Cl⁻ 检验避免引入 Cl⁻。只做安全的概念分析。"),
  mole:lesson("mole","第三节 · 物质的量","用摩尔把指定粒子的数目、质量和有条件的气体体积连起来。",
    "物质的量 n 的单位是 mol，先注明计数对象。N=nNₐ、m=nM；气体 V=nVₘ 仅在给定温度和压强且对象为气体时使用。系数表示粒子数或物质的量比，不是质量比。",
    "不看答案说出 1 mol H₂O 的分子、H 原子、O 原子各多少；算 8 g O₂ 的物质的量；解释为什么 25 ℃不能随手用 22.4 L/mol。",mole,{mol_object:"mol_entities",mol_stoich_mass:"mol_stoich",mol_gas_any:"mol_gas_standard",mol_water_liquid:"mol_gas_standard"},
    "每次计算写清粒子对象、公式、数值和单位。1 mol=指定粒子数，不是质量。相对分子质量无量纲，摩尔质量单位常为 g/mol。标准状况本课取约 0℃、101.325kPa，理想气体 Vₘ 约 22.4 L/mol；液体不能套用。"),
  solution_preparation:lesson("solution_preparation","实验活动 · 配制一定物质的量浓度的溶液","从 c=n/V 出发，完成计算、仪器选择、定量转移、定容和误差分析。",
    "c=n/V 中 V 是最终溶液体积。固体先在烧杯溶解并冷却，再转移、洗涤、定容、摇匀。误差只用进入容量瓶的溶质 n 与最终体积 V 分析，并注明温度与损失前提。",
    "不看答案算配制 500 mL、0.200 mol/L NaCl 需要多少克；复述配液步骤；用 c=n/V 分析溶质洒出与定容过线。",solutionPreparation,{conc_rinse_false:"conc_rinse",conc_overfill:"conc_formula",conc_loss:"conc_rinse"},
    "先辨别最终溶液体积，不把溶剂水体积当 V。500mL 0.200mol/L NaCl 理论称量约 5.85g。容量瓶不加热、不直接溶解固体；溶液冷却后转移和定容。转移损失 n↓，定容过线 V↑，均使 c↓；热时定容需说明热胀冷缩前提。")
};

for (const item of Object.values(lessons)) if (item.corePath.length < 15) throw new Error(`第二章案例过少：${item.id}`);
module.exports={lessons,newTerms,prerequisites};
