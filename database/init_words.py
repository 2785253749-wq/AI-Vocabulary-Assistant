"""
单词种子数据 — 100个CET-4级别常用单词
运行方式: cd backend && python ../database/init_words.py
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app
from models.word import Word
from extensions import db

WORDS = [
    # A
    {"word": "abandon", "phonetic": "/əˈbændən/", "meaning": "放弃，抛弃", "example": "They had to abandon the sinking ship.", "difficulty": 2},
    {"word": "ability", "phonetic": "/əˈbɪləti/", "meaning": "能力，才能", "example": "She has the ability to learn quickly.", "difficulty": 1},
    {"word": "absent", "phonetic": "/ˈæbsənt/", "meaning": "缺席的，不在的", "example": "He was absent from school yesterday.", "difficulty": 1},
    {"word": "absorb", "phonetic": "/əbˈzɔːrb/", "meaning": "吸收，吸引", "example": "Plants absorb water from the soil.", "difficulty": 2},
    {"word": "abstract", "phonetic": "/ˈæbstrækt/", "meaning": "抽象的，摘要", "example": "The idea is too abstract to understand.", "difficulty": 3},
    {"word": "abundant", "phonetic": "/əˈbʌndənt/", "meaning": "丰富的，充裕的", "example": "The region has abundant natural resources.", "difficulty": 2},
    {"word": "academic", "phonetic": "/ˌækəˈdemɪk/", "meaning": "学术的，学院的", "example": "She has an excellent academic record.", "difficulty": 2},
    {"word": "accelerate", "phonetic": "/əkˈseləreɪt/", "meaning": "加速，促进", "example": "The car can accelerate from 0 to 100 in 6 seconds.", "difficulty": 3},
    {"word": "access", "phonetic": "/ˈækses/", "meaning": "进入，访问，通道", "example": "Students have access to the library online.", "difficulty": 2},
    {"word": "accompany", "phonetic": "/əˈkʌmpəni/", "meaning": "陪伴，伴随", "example": "I will accompany you to the station.", "difficulty": 2},

    # B
    {"word": "balance", "phonetic": "/ˈbæləns/", "meaning": "平衡，余额", "example": "You need to keep a balance between work and life.", "difficulty": 2},
    {"word": "barrier", "phonetic": "/ˈbæriər/", "meaning": "障碍，屏障", "example": "Language is not a barrier to friendship.", "difficulty": 2},
    {"word": "benefit", "phonetic": "/ˈbenɪfɪt/", "meaning": "利益，好处，受益", "example": "Exercise brings many benefits to health.", "difficulty": 1},
    {"word": "brilliant", "phonetic": "/ˈbrɪliənt/", "meaning": "杰出的，明亮的", "example": "She came up with a brilliant idea.", "difficulty": 2},
    {"word": "budget", "phonetic": "/ˈbʌdʒɪt/", "meaning": "预算", "example": "We need to plan our budget carefully.", "difficulty": 2},
    {"word": "burden", "phonetic": "/ˈbɜːrdn/", "meaning": "负担，重担", "example": "The heavy workload became a burden.", "difficulty": 2},

    # C
    {"word": "calculate", "phonetic": "/ˈkælkjuleɪt/", "meaning": "计算，估计", "example": "Can you calculate the total cost?", "difficulty": 2},
    {"word": "campaign", "phonetic": "/kæmˈpeɪn/", "meaning": "运动，战役，竞选", "example": "They launched an advertising campaign.", "difficulty": 3},
    {"word": "capable", "phonetic": "/ˈkeɪpəbl/", "meaning": "有能力的", "example": "She is capable of handling this task.", "difficulty": 2},
    {"word": "capture", "phonetic": "/ˈkæptʃər/", "meaning": "捕获，吸引，俘获", "example": "The photo captured a beautiful moment.", "difficulty": 2},
    {"word": "career", "phonetic": "/kəˈrɪr/", "meaning": "职业，生涯", "example": "She chose teaching as her career.", "difficulty": 1},
    {"word": "celebrate", "phonetic": "/ˈselɪbreɪt/", "meaning": "庆祝", "example": "We celebrate Christmas every year.", "difficulty": 1},
    {"word": "challenge", "phonetic": "/ˈtʃælɪndʒ/", "meaning": "挑战", "example": "Finishing this project is a real challenge.", "difficulty": 2},
    {"word": "character", "phonetic": "/ˈkærəktər/", "meaning": "性格，角色，字符", "example": "He has a strong character.", "difficulty": 2},
    {"word": "circumstance", "phonetic": "/ˈsɜːrkəmstæns/", "meaning": "环境，情况", "example": "Under no circumstances should you lie.", "difficulty": 3},
    {"word": "collapse", "phonetic": "/kəˈlæps/", "meaning": "倒塌，崩溃", "example": "The building collapsed after the earthquake.", "difficulty": 2},
    {"word": "command", "phonetic": "/kəˈmænd/", "meaning": "命令，指挥，掌握", "example": "He has a good command of English.", "difficulty": 2},
    {"word": "communicate", "phonetic": "/kəˈmjuːnɪkeɪt/", "meaning": "交流，沟通", "example": "We communicate by email every day.", "difficulty": 2},
    {"word": "compete", "phonetic": "/kəmˈpiːt/", "meaning": "竞争，比赛", "example": "Ten teams will compete in the tournament.", "difficulty": 2},
    {"word": "confident", "phonetic": "/ˈkɑːnfɪdənt/", "meaning": "自信的，确信的", "example": "She is confident about passing the exam.", "difficulty": 2},
    {"word": "consult", "phonetic": "/kənˈsʌlt/", "meaning": "咨询，请教", "example": "You should consult a doctor about this.", "difficulty": 2},
    {"word": "contribute", "phonetic": "/kənˈtrɪbjuːt/", "meaning": "贡献，捐献", "example": "Everyone should contribute to the team.", "difficulty": 3},
    {"word": "convince", "phonetic": "/kənˈvɪns/", "meaning": "说服，使确信", "example": "I tried to convince him to stay.", "difficulty": 2},
    {"word": "crucial", "phonetic": "/ˈkruːʃl/", "meaning": "关键的，至关重要的", "example": "Time management is crucial for success.", "difficulty": 2},

    # D
    {"word": "decline", "phonetic": "/dɪˈklaɪn/", "meaning": "下降，拒绝", "example": "The company's profits began to decline.", "difficulty": 2},
    {"word": "definitely", "phonetic": "/ˈdefɪnətli/", "meaning": "肯定地，明确地", "example": "I will definitely come to the party.", "difficulty": 1},
    {"word": "demonstrate", "phonetic": "/ˈdemənstreɪt/", "meaning": "展示，证明，示威", "example": "Let me demonstrate how this works.", "difficulty": 3},
    {"word": "deserve", "phonetic": "/dɪˈzɜːrv/", "meaning": "值得，应得", "example": "You deserve a good rest after hard work.", "difficulty": 1},
    {"word": "destroy", "phonetic": "/dɪˈstrɔɪ/", "meaning": "破坏，毁灭", "example": "The fire destroyed the entire building.", "difficulty": 2},
    {"word": "determine", "phonetic": "/dɪˈtɜːrmɪn/", "meaning": "决定，确定", "example": "We need to determine the cause of the problem.", "difficulty": 2},
    {"word": "disappear", "phonetic": "/ˌdɪsəˈpɪr/", "meaning": "消失，不见", "example": "The sun disappeared behind the clouds.", "difficulty": 2},
    {"word": "discover", "phonetic": "/dɪˈskʌvər/", "meaning": "发现，发觉", "example": "Scientists discovered a new planet.", "difficulty": 1},
    {"word": "distinguish", "phonetic": "/dɪˈstɪŋɡwɪʃ/", "meaning": "区分，辨别", "example": "Can you distinguish between the two sounds?", "difficulty": 3},
    {"word": "distribute", "phonetic": "/dɪˈstrɪbjuːt/", "meaning": "分配，分布", "example": "Volunteers distributed food to the homeless.", "difficulty": 3},
    {"word": "domestic", "phonetic": "/dəˈmestɪk/", "meaning": "国内的，家庭的", "example": "The domestic flight takes about two hours.", "difficulty": 2},
    {"word": "dramatic", "phonetic": "/drəˈmætɪk/", "meaning": "戏剧性的，巨大的", "example": "There has been a dramatic change in weather.", "difficulty": 2},

    # E
    {"word": "economy", "phonetic": "/ɪˈkɑːnəmi/", "meaning": "经济，节约", "example": "The global economy is recovering slowly.", "difficulty": 2},
    {"word": "efficient", "phonetic": "/ɪˈfɪʃnt/", "meaning": "高效的", "example": "This machine is very energy efficient.", "difficulty": 2},
    {"word": "eliminate", "phonetic": "/ɪˈlɪmɪneɪt/", "meaning": "消除，淘汰", "example": "We must eliminate all sources of error.", "difficulty": 3},
    {"word": "embrace", "phonetic": "/ɪmˈbreɪs/", "meaning": "拥抱，欣然接受", "example": "We should embrace new technology.", "difficulty": 2},
    {"word": "emerge", "phonetic": "/ɪˈmɜːrdʒ/", "meaning": "出现，浮现", "example": "New details began to emerge from the investigation.", "difficulty": 2},
    {"word": "emphasis", "phonetic": "/ˈemfəsɪs/", "meaning": "强调，重点", "example": "The school puts great emphasis on reading.", "difficulty": 2},
    {"word": "encounter", "phonetic": "/ɪnˈkaʊntər/", "meaning": "遭遇，遇见", "example": "We encountered many difficulties on the way.", "difficulty": 2},
    {"word": "enormous", "phonetic": "/ɪˈnɔːrməs/", "meaning": "巨大的，庞大的", "example": "The project cost an enormous amount of money.", "difficulty": 2},
    {"word": "essential", "phonetic": "/ɪˈsenʃl/", "meaning": "必要的，本质的", "example": "Water is essential for life.", "difficulty": 2},
    {"word": "establish", "phonetic": "/ɪˈstæblɪʃ/", "meaning": "建立，设立", "example": "The company was established in 1990.", "difficulty": 2},
    {"word": "evidence", "phonetic": "/ˈevɪdəns/", "meaning": "证据，迹象", "example": "There is no evidence to support his claim.", "difficulty": 2},
    {"word": "exaggerate", "phonetic": "/ɪɡˈzædʒəreɪt/", "meaning": "夸张，夸大", "example": "Don't exaggerate the seriousness of the problem.", "difficulty": 3},
    {"word": "explore", "phonetic": "/ɪkˈsplɔːr/", "meaning": "探索，探究", "example": "We spent the day exploring the old city.", "difficulty": 2},

    # F
    {"word": "familiar", "phonetic": "/fəˈmɪliər/", "meaning": "熟悉的", "example": "Her face looks familiar but I can't remember her name.", "difficulty": 1},
    {"word": "fascinate", "phonetic": "/ˈfæsɪneɪt/", "meaning": "使着迷，吸引", "example": "Dinosaurs fascinate young children.", "difficulty": 2},
    {"word": "flexible", "phonetic": "/ˈfleksəbl/", "meaning": "灵活的，柔韧的", "example": "We offer flexible working hours.", "difficulty": 2},
    {"word": "flourish", "phonetic": "/ˈflɜːrɪʃ/", "meaning": "繁荣，兴旺", "example": "The business began to flourish under new management.", "difficulty": 2},
    {"word": "frequent", "phonetic": "/ˈfriːkwənt/", "meaning": "频繁的", "example": "He is a frequent visitor to the museum.", "difficulty": 2},
    {"word": "fundamental", "phonetic": "/ˌfʌndəˈmentl/", "meaning": "基本的，根本的", "example": "This is a fundamental principle of physics.", "difficulty": 3},

    # G
    {"word": "generate", "phonetic": "/ˈdʒenəreɪt/", "meaning": "产生，生成", "example": "The wind farm generates electricity for the town.", "difficulty": 2},
    {"word": "genuine", "phonetic": "/ˈdʒenjuɪn/", "meaning": "真正的，真诚的", "example": "She showed genuine concern for the children.", "difficulty": 2},
    {"word": "gradual", "phonetic": "/ˈɡrædʒuəl/", "meaning": "逐渐的", "example": "There has been a gradual improvement in his health.", "difficulty": 2},
    {"word": "guarantee", "phonetic": "/ˌɡærənˈtiː/", "meaning": "保证，担保", "example": "Hard work doesn't guarantee success.", "difficulty": 2},

    # H
    {"word": "hesitate", "phonetic": "/ˈhezɪteɪt/", "meaning": "犹豫，迟疑", "example": "Don't hesitate to ask for help.", "difficulty": 2},
    {"word": "highlight", "phonetic": "/ˈhaɪlaɪt/", "meaning": "突出，强调，亮点", "example": "This report highlights the key issues.", "difficulty": 2},
    {"word": "horizon", "phonetic": "/həˈraɪzn/", "meaning": "地平线，眼界", "example": "Traveling broadens your horizon.", "difficulty": 2},

    # I
    {"word": "illustrate", "phonetic": "/ˈɪləstreɪt/", "meaning": "说明，阐明，插图", "example": "Let me illustrate my point with a story.", "difficulty": 3},
    {"word": "immediate", "phonetic": "/ɪˈmiːdiət/", "meaning": "立即的，直接的", "example": "We need an immediate response to this matter.", "difficulty": 2},
    {"word": "incident", "phonetic": "/ˈɪnsɪdənt/", "meaning": "事件，事故", "example": "The police are investigating the incident.", "difficulty": 2},
    {"word": "independent", "phonetic": "/ˌɪndɪˈpendənt/", "meaning": "独立的，自主的", "example": "She is very independent and makes her own decisions.", "difficulty": 2},
    {"word": "indicate", "phonetic": "/ˈɪndɪkeɪt/", "meaning": "表明，指示", "example": "Research indicates that exercise improves mood.", "difficulty": 2},
    {"word": "influence", "phonetic": "/ˈɪnfluəns/", "meaning": "影响，影响力", "example": "Parents have a great influence on their children.", "difficulty": 2},
    {"word": "inspire", "phonetic": "/ɪnˈspaɪər/", "meaning": "激励，启发，鼓舞", "example": "Her story inspired many people to take action.", "difficulty": 2},
    {"word": "instrument", "phonetic": "/ˈɪnstrəmənt/", "meaning": "工具，乐器，仪器", "example": "She can play three musical instruments.", "difficulty": 2},
    {"word": "investigate", "phonetic": "/ɪnˈvestɪɡeɪt/", "meaning": "调查，研究", "example": "The committee will investigate the complaint.", "difficulty": 3},
    {"word": "involve", "phonetic": "/ɪnˈvɑːlv/", "meaning": "涉及，包含，使参与", "example": "The job involves a lot of travel.", "difficulty": 2},

    # J - K
    {"word": "judgment", "phonetic": "/ˈdʒʌdʒmənt/", "meaning": "判断，判断力", "example": "I trust your judgment on this matter.", "difficulty": 2},
    {"word": "justify", "phonetic": "/ˈdʒʌstɪfaɪ/", "meaning": "证明...合理", "example": "How can you justify such behavior?", "difficulty": 3},
    {"word": "knowledge", "phonetic": "/ˈnɑːlɪdʒ/", "meaning": "知识，学问", "example": "Knowledge is power.", "difficulty": 1},

    # L
    {"word": "landscape", "phonetic": "/ˈlændskeɪp/", "meaning": "风景，景观", "example": "The landscape was breathtakingly beautiful.", "difficulty": 2},
    {"word": "launch", "phonetic": "/lɔːntʃ/", "meaning": "发射，发起，推出", "example": "The company plans to launch a new product next month.", "difficulty": 2},
    {"word": "legislation", "phonetic": "/ˌledʒɪsˈleɪʃn/", "meaning": "立法，法规", "example": "New legislation will protect consumers' rights.", "difficulty": 3},

    # M
    {"word": "magnificent", "phonetic": "/mæɡˈnɪfɪsnt/", "meaning": "壮丽的，宏伟的", "example": "The view from the mountain was magnificent.", "difficulty": 2},
    {"word": "maintain", "phonetic": "/meɪnˈteɪn/", "meaning": "维持，保持，保养", "example": "You should maintain a healthy diet.", "difficulty": 2},
    {"word": "measure", "phonetic": "/ˈmeʒər/", "meaning": "测量，衡量，措施", "example": "The government took measures to control inflation.", "difficulty": 2},
    {"word": "moderate", "phonetic": "/ˈmɑːdərət/", "meaning": "适度的，温和的", "example": "Moderate exercise is good for your health.", "difficulty": 2},

    # N
    {"word": "negotiate", "phonetic": "/nɪˈɡoʊʃieɪt/", "meaning": "谈判，协商", "example": "The two sides are negotiating a peace deal.", "difficulty": 3},
    {"word": "numerous", "phonetic": "/ˈnuːmərəs/", "meaning": "许多的，大量的", "example": "There are numerous reasons to be optimistic.", "difficulty": 2},

    # O
    {"word": "obstacle", "phonetic": "/ˈɑːbstəkl/", "meaning": "障碍，阻碍", "example": "Lack of funding is the main obstacle.", "difficulty": 2},
    {"word": "opportunity", "phonetic": "/ˌɑːpərˈtuːnəti/", "meaning": "机会，时机", "example": "This is a great opportunity to learn new skills.", "difficulty": 2},
    {"word": "ordinary", "phonetic": "/ˈɔːrdneri/", "meaning": "普通的，平常的", "example": "It was just an ordinary day at work.", "difficulty": 1},

    # P
    {"word": "participate", "phonetic": "/pɑːrˈtɪsɪpeɪt/", "meaning": "参与，参加", "example": "Everyone is encouraged to participate in the discussion.", "difficulty": 3},
    {"word": "permanent", "phonetic": "/ˈpɜːrmənənt/", "meaning": "永久的，长期的", "example": "He is looking for a permanent job.", "difficulty": 2},
    {"word": "persuade", "phonetic": "/pərˈsweɪd/", "meaning": "说服，劝说", "example": "I persuaded her to join the team.", "difficulty": 2},
    {"word": "phenomenon", "phonetic": "/fɪˈnɑːmɪnən/", "meaning": "现象，奇观", "example": "Global warming is a complex phenomenon.", "difficulty": 3},
    {"word": "potential", "phonetic": "/pəˈtenʃl/", "meaning": "潜力，潜在的", "example": "This area has great potential for development.", "difficulty": 2},
    {"word": "precious", "phonetic": "/ˈpreʃəs/", "meaning": "珍贵的，宝贵的", "example": "Time is the most precious resource.", "difficulty": 2},
    {"word": "predict", "phonetic": "/prɪˈdɪkt/", "meaning": "预测，预言", "example": "It's hard to predict what will happen.", "difficulty": 2},
    {"word": "promote", "phonetic": "/prəˈmoʊt/", "meaning": "促进，提升，推广", "example": "The campaign aims to promote healthy eating.", "difficulty": 2},
    {"word": "purchase", "phonetic": "/ˈpɜːrtʃəs/", "meaning": "购买", "example": "You can purchase tickets online.", "difficulty": 2},

    # R
    {"word": "reluctant", "phonetic": "/rɪˈlʌktənt/", "meaning": "不情愿的，勉强的", "example": "She was reluctant to leave her hometown.", "difficulty": 3},
    {"word": "represent", "phonetic": "/ˌreprɪˈzent/", "meaning": "代表，表示", "example": "Each color represents a different meaning.", "difficulty": 2},
    {"word": "resolve", "phonetic": "/rɪˈzɑːlv/", "meaning": "解决，决心", "example": "We need to resolve this issue quickly.", "difficulty": 2},
    {"word": "resource", "phonetic": "/ˈriːsɔːrs/", "meaning": "资源，财力", "example": "The library is a valuable resource for students.", "difficulty": 2},
    {"word": "responsibility", "phonetic": "/rɪˌspɑːnsəˈbɪləti/", "meaning": "责任，职责", "example": "It's your responsibility to complete the task on time.", "difficulty": 2},
    {"word": "reveal", "phonetic": "/rɪˈviːl/", "meaning": "揭示，透露", "example": "The report reveals some shocking facts.", "difficulty": 2},

    # S
    {"word": "sacrifice", "phonetic": "/ˈsækrɪfaɪs/", "meaning": "牺牲，献祭", "example": "She made many sacrifices for her family.", "difficulty": 2},
    {"word": "significant", "phonetic": "/sɪɡˈnɪfɪkənt/", "meaning": "重要的，显著的", "example": "There has been a significant increase in sales.", "difficulty": 2},
    {"word": "sophisticated", "phonetic": "/səˈfɪstɪkeɪtɪd/", "meaning": "复杂的，精密的，老练的", "example": "This is a highly sophisticated computer system.", "difficulty": 3},
    {"word": "strategy", "phonetic": "/ˈstrætədʒi/", "meaning": "策略，战略", "example": "We need a new marketing strategy.", "difficulty": 2},
    {"word": "sufficient", "phonetic": "/səˈfɪʃnt/", "meaning": "足够的，充分的", "example": "Do you have sufficient evidence for the claim?", "difficulty": 2},
    {"word": "superior", "phonetic": "/suːˈpɪriər/", "meaning": "优越的，上级的", "example": "This product is superior to its competitors.", "difficulty": 2},
    {"word": "suspicious", "phonetic": "/səˈspɪʃəs/", "meaning": "可疑的，怀疑的", "example": "The police found his behavior suspicious.", "difficulty": 2},
    {"word": "sustain", "phonetic": "/səˈsteɪn/", "meaning": "维持，支撑，承受", "example": "We must find ways to sustain economic growth.", "difficulty": 3},

    # T
    {"word": "temporary", "phonetic": "/ˈtempəreri/", "meaning": "临时的，暂时的", "example": "This is only a temporary solution.", "difficulty": 2},
    {"word": "tendency", "phonetic": "/ˈtendənsi/", "meaning": "倾向，趋势", "example": "There is a tendency for prices to rise.", "difficulty": 2},
    {"word": "transform", "phonetic": "/trænsˈfɔːrm/", "meaning": "改变，转变", "example": "Technology has transformed our daily lives.", "difficulty": 2},
    {"word": "tremendous", "phonetic": "/trɪˈmendəs/", "meaning": "巨大的，极大的", "example": "She has made tremendous progress this year.", "difficulty": 2},
    {"word": "typical", "phonetic": "/ˈtɪpɪkl/", "meaning": "典型的，通常的", "example": "This is a typical example of his work.", "difficulty": 2},

    # U
    {"word": "ultimate", "phonetic": "/ˈʌltɪmət/", "meaning": "最终的，终极的", "example": "Our ultimate goal is to eliminate poverty.", "difficulty": 2},
    {"word": "universal", "phonetic": "/ˌjuːnɪˈvɜːrsl/", "meaning": "普遍的，全世界的", "example": "Music is a universal language.", "difficulty": 2},
    {"word": "urgent", "phonetic": "/ˈɜːrdʒənt/", "meaning": "紧急的，急迫的", "example": "There is an urgent need for medical supplies.", "difficulty": 2},

    # V
    {"word": "valuable", "phonetic": "/ˈvæljuəbl/", "meaning": "有价值的，贵重的", "example": "She gave me some valuable advice.", "difficulty": 1},
    {"word": "violence", "phonetic": "/ˈvaɪələns/", "meaning": "暴力，猛烈", "example": "The movie contains scenes of violence.", "difficulty": 2},
    {"word": "visible", "phonetic": "/ˈvɪzəbl/", "meaning": "可见的，明显的", "example": "The stars are clearly visible tonight.", "difficulty": 2},
    {"word": "vulnerable", "phonetic": "/ˈvʌlnərəbl/", "meaning": "脆弱的，易受伤的", "example": "Children are most vulnerable to the disease.", "difficulty": 3},
]


def init_words():
    app = create_app()
    with app.app_context():
        # 清空旧数据
        db.drop_all()
        db.create_all()
        print("数据库表已重新创建")

        count = 0
        for w in WORDS:
            existing = Word.query.filter_by(word=w['word']).first()
            if not existing:
                word = Word(**w)
                db.session.add(word)
                count += 1

        db.session.commit()
        print(f"成功导入 {count} 个单词")
        print(f"单词总数: {Word.query.count()}")


if __name__ == '__main__':
    init_words()
