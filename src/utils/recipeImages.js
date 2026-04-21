// ============================================================
// Hash function: same title → same number → same image (deterministic)
// ============================================================
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

// ============================================================
// Stop words to clean Spanish recipe titles
// ============================================================
const STOP_WORDS = new Set([
    'receta', 'de', 'del', 'la', 'el', 'los', 'las', 'con', 'y', 'en',
    'al', 'a', 'un', 'una', 'unos', 'unas', 'para', 'por', 'su', 'sin',
    'fácil', 'facil', 'casero', 'casera', 'rápido', 'rápida', 'original',
    'mejor', 'mejores', 'tipo', 'estilo', 'como', 'hacer', 'preparar',
    'rellenos', 'rellenas', 'relleno', 'rellena', 'ahumado', 'ahumada',
]);

// ============================================================
// MULTIPLE images per keyword = no repeats between recipes
// ============================================================
const u = (id) => `https://images.unsplash.com/${id}?w=600&h=400&fit=crop`;

const FOOD_IMAGES = {
    'salmón': [u('photo-1467003909585-2f8a72700288'), u('photo-1519708227418-c8fd9a32b7a0'), u('photo-1574781330855-d0db8cc6a79c'), u('photo-1485921325833-c519f76c4927'), u('photo-1559742811-82282369258c')],
    'salmon': [u('photo-1467003909585-2f8a72700288'), u('photo-1519708227418-c8fd9a32b7a0'), u('photo-1574781330855-d0db8cc6a79c'), u('photo-1485921325833-c519f76c4927'), u('photo-1559742811-82282369258c')],
    'pollo': [u('photo-1598103442097-8b74f0e1f1b0'), u('photo-1604908176997-125f25cc6f3d'), u('photo-1632778149955-e80f8ceca2e8'), u('photo-1588767768106-1b20e51d9d68'), u('photo-1606728035253-0fde75975244')],
    'pasta': [u('photo-1621996346565-e3dbc646d9a9'), u('photo-1563379926898-05f4575a45d8'), u('photo-1551183053-bf91a1d81141'), u('photo-1516100882582-96c3a05fe590'), u('photo-1555072956-7758afb20e8f')],
    'ensalada': [u('photo-1512621776951-a57141f2eefd'), u('photo-1540420773420-3366772f4999'), u('photo-1607532941433-304659e8198a'), u('photo-1546793665-c74683f339c1'), u('photo-1490645935967-10de6ba17061')],
    'pizza': [u('photo-1565299624946-b28f40a0ae38'), u('photo-1574071318508-1cdbab80d002'), u('photo-1513104890138-7c749659a591'), u('photo-1571407970349-bc81e7e96d47'), u('photo-1593560708920-61dd98c46a4e')],
    'hamburguesa': [u('photo-1568901346375-23c9450c58cd'), u('photo-1550547660-d9450f859349'), u('photo-1571091718767-18b5b1457add'), u('photo-1586190848861-99aa4a171e90'), u('photo-1551782450-a2132b4ba21d')],
    'carne': [u('photo-1558030006-450675393462'), u('photo-1588168333986-5078d3ae3976'), u('photo-1529692236671-f1f6cf9683ba'), u('photo-1544025162-d76694265947'), u('photo-1603360946369-dc9bb6258143')],
    'ternera': [u('photo-1558030006-450675393462'), u('photo-1546964124-0cce460f38ef'), u('photo-1588168333986-5078d3ae3976'), u('photo-1594041680534-e8c8cdebd679')],
    'cerdo': [u('photo-1432139555190-58524dae6a55'), u('photo-1606728035253-0fde75975244'), u('photo-1529692236671-f1f6cf9683ba'), u('photo-1602491673980-73aa38de027a')],
    'pescado': [u('photo-1510130113560-611e66fa6f72'), u('photo-1534604973900-c43ab4c2e0ab'), u('photo-1519708227418-c8fd9a32b7a0'), u('photo-1485921325833-c519f76c4927'), u('photo-1526318896980-cf78c088247c')],
    'atún': [u('photo-1546069901-ba9599a7e63c'), u('photo-1534604973900-c43ab4c2e0ab'), u('photo-1504674900247-0877df9cc836')],
    'atun': [u('photo-1546069901-ba9599a7e63c'), u('photo-1534604973900-c43ab4c2e0ab'), u('photo-1504674900247-0877df9cc836')],
    'marisco': [u('photo-1565680018434-b513d5e5fd47'), u('photo-1625943553852-781c6dd46faa'), u('photo-1551504734-5ee1c4a1479b'), u('photo-1534080564617-3874d623f99e')],
    'camarones': [u('photo-1565680018434-b513d5e5fd47'), u('photo-1625943553852-781c6dd46faa'), u('photo-1551504734-5ee1c4a1479b')],
    'arroz': [u('photo-1536304929831-ee1ca9d44726'), u('photo-1516684732162-798a0062be99'), u('photo-1603133872878-684f208fb84b'), u('photo-1512058564366-18510be2db19')],
    'sopa': [u('photo-1547592166-23ac45744aec'), u('photo-1603105037880-880cd4f5b2d6'), u('photo-1588566565463-180a5b2090d2'), u('photo-1542124948-dc391252a940')],
    'postre': [u('photo-1488477181946-6428a0291777'), u('photo-1563729784474-d77dbb933a9e'), u('photo-1551024506-0bccd828d307'), u('photo-1565958011703-44f9829ba187'), u('photo-1567620817605-274ef342f15a')],
    'tarta': [u('photo-1488477181946-6428a0291777'), u('photo-1563729784474-d77dbb933a9e'), u('photo-1588195538326-c5b1e9f80a1b'), u('photo-1578985545062-69928b1d9587')],
    'pastel': [u('photo-1578985545062-69928b1d9587'), u('photo-1488477181946-6428a0291777'), u('photo-1563729784474-d77dbb933a9e')],
    'fruta': [u('photo-1490818387583-1baba5e638af'), u('photo-1519996529931-28324d5a630e'), u('photo-1610832958506-aa56368176cf'), u('photo-1512149177596-f817c7ef5d4c')],
    'verduras': [u('photo-1540420773420-3366772f4999'), u('photo-1512621776951-a57141f2eefd'), u('photo-1607532941433-304659e8198a'), u('photo-1598170845058-32b9d6a5dafa')],
    'bebida': [u('photo-1544145945-f904253d0c7b'), u('photo-1513558161293-cdaf765ed2fd'), u('photo-1536935338213-94ba2343feaf'), u('photo-1551024709-8f23befc6f87')],
    'café': [u('photo-1509042239860-f550ce710b93'), u('photo-1495474472287-4d71bcdd2085'), u('photo-1447933630983-c4606c5a439c')],
    'desayuno': [u('photo-1525351484163-7529414344d8'), u('photo-1484723091739-30a097e8f929'), u('photo-1533089860891-a7309b51f43a'), u('photo-1493770348161-369560ae357d')],
    'aperitivo': [u('photo-1541529086526-db283c563270'), u('photo-1506280754576-f6fa8a873550'), u('photo-1572695157366-5e585ab2b69f'), u('photo-1567620905732-2d1ec7ab7445')],
    'tapas': [u('photo-1541529086526-db283c563270'), u('photo-1506280754576-f6fa8a873550'), u('photo-1572695157366-5e585ab2b69f')],
    'mariscos': [u('photo-1565680018434-b513d5e5fd47'), u('photo-1625943553852-781c6dd46faa'), u('photo-1551504734-5ee1c4a1479b'), u('photo-1534080564617-3874d623f99e')],
    'legumbres': [u('photo-1515942400420-2b98fed1f515'), u('photo-1585808441130-bb4696009892'), u('photo-1590219602416-897db6720bb2')],
    'bollería': [u('photo-1509440159596-0249088772ff'), u('photo-1558961363-fa8fdf82db35'), u('photo-1509365465985-25d11c17e812')],
    'salsa': [u('photo-1476224203421-9ac39bcb3327'), u('photo-1529006557870-1f3eb1464321'), u('photo-1534938665420-4193effeabd4')],
    'crema': [u('photo-1547592166-23ac45744aec'), u('photo-1603105037880-880cd4f5b2d6'), u('photo-1542124948-dc391252a940')],
};

// ============================================================
// 50 general food images for titles that don't match any keyword
// ============================================================
const GENERAL_FOOD = [
    u('photo-1504674900247-0877df9cc836'),
    u('photo-1555939594-58d7cb561ad1'),
    u('photo-1567620905732-2d1ec7ab7445'),
    u('photo-1565299624946-b28f40a0ae38'),
    u('photo-1540189549336-e6e99c3679fe'),
    u('photo-1476224203421-9ac39bcb3327'),
    u('photo-1414235077428-338989a2e8c0'),
    u('photo-1473093295043-cdd812d0e601'),
    u('photo-1498837167922-ddd27525d352'),
    u('photo-1493770348161-369560ae357d'),
    u('photo-1455619452474-d2be8b1e70cd'),
    u('photo-1432139555190-58524dae6a55'),
    u('photo-1506354666786-959d6d497f1a'),
    u('photo-1547592180-85f173990554'),
    u('photo-1482049016688-2d3e1b311543'),
    u('photo-1484980972926-edee96e0960d'),
    u('photo-1529042410759-befb1204b468'),
    u('photo-1546069901-ba9599a7e63c'),
    u('photo-1490645935967-10de6ba17061'),
    u('photo-1495521821757-a1efb6729352'),
    u('photo-1543339308-d595b967b068'),
    u('photo-1551218808-94e220e084d2'),
    u('photo-1559847844-5315695dadae'),
    u('photo-1558030006-450675393462'),
    u('photo-1517248135467-4c7edcad34c4'),
    u('photo-1563379926898-05f4575a45d8'),
    u('photo-1516100882582-96c3a05fe590'),
    u('photo-1574071318508-1cdbab80d002'),
    u('photo-1550547660-d9450f859349'),
    u('photo-1571091718767-18b5b1457add'),
    u('photo-1532980400857-e8d9d275d858'),
    u('photo-1561758033-d89a9ad46330'),
    u('photo-1565299507177-b0ac66763828'),
    u('photo-1565299585323-38d6b0865b47'),
    u('photo-1560684352-8497838ca281'),
    u('photo-1581005014300-36224d033621'),
    u('photo-1541745537411-b8046dc6d66c'),
    u('photo-1551183053-bf91a1d81141'),
    u('photo-1515003197210-e0cd71810b5f'),
    u('photo-1511688827399-7b6a9809c23a'),
    u('photo-1512152272829-d311974e82a7'),
    u('photo-1505935428862-770b6f24f629'),
    u('photo-1551024601-bec78aea704b'),
    u('photo-1512485600744-832303b34ab1'),
    u('photo-1504509546545-e000b4a62425'),
    u('photo-1490818387583-1baba5e638af'),
    u('photo-1481671703460-040cb8a2d909'),
    u('photo-1493020256206-76e462d7c510'),
    u('photo-1496662559119-b914856c497a'),
    u('photo-1473093226795-af9932fe5856'),
];

// ============================================================
// Extract food keyword from Spanish recipe title
// ============================================================
const extractKeywords = (title) => {
    if (!title) return [];
    return title
        .toLowerCase()
        .replace(/[^a-záéíóúñü\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
};

// ============================================================
// Pick a unique image for each recipe (deterministic by title)
// ============================================================
export const getUniqueImageForRecipe = (title) => {
    if (!title) title = '';
    const hash = hashString(title);
    const words = extractKeywords(title);

    // Try to match a keyword with our curated pools
    for (const word of words) {
        if (FOOD_IMAGES[word]) {
            const pool = FOOD_IMAGES[word];
            return pool[hash % pool.length];
        }
    }

    // No keyword match → pick from the general food pool
    return GENERAL_FOOD[hash % GENERAL_FOOD.length];
};
