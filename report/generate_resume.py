"""生成优化版个人简历 PDF"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# 注册中文字体
font_dir = r'C:\Windows\Fonts'
FONT_BOLD = 'SimHei'
FONT_NORMAL = 'SimHei'  # Windows上报告宋体ttc有问题，统一用黑体
pdfmetrics.registerFont(TTFont('SimHei', os.path.join(font_dir, 'simhei.ttf')))

PDF_WIDTH, PDF_HEIGHT = A4
OUTPUT = r'D:\Users\Asus\Desktop\2023 计算机科学与技术 黄羽 12512023028 个人简历.pdf'

c = canvas.Canvas(OUTPUT, pagesize=A4)
W = PDF_WIDTH

# 颜色
BLUE = '#1a5276'
GRAY = '#666666'
LIGHT_GRAY = '#999999'
LINE_COLOR = '#2e86c1'
WHITE = '#ffffff'
BG_LIGHT = '#eaf2f8'

def set_font(name='SimHei', size=10):
    try:
        c.setFont(name, size)
    except:
        c.setFont('Helvetica', size)

def draw_line(y, color=LINE_COLOR, width=1):
    c.setStrokeColor(HexColor(color))
    c.setLineWidth(width)
    c.line(20*mm, y, W-20*mm, y)

def draw_section_title(y, title):
    c.setFillColor(HexColor(BLUE))
    c.rect(20*mm, y, 3*mm, 6*mm, fill=1, stroke=0)
    c.setFillColor(HexColor('#222222'))
    set_font('SimHei', 14)
    c.drawString(26*mm, y-1*mm, title)
    draw_line(y-3*mm)
    return y - 12*mm

def draw_text(x, y, text, size=10, color='#333333', bold=False):
    c.setFillColor(HexColor(color))
    set_font('SimHei' if bold else 'SimHei', size)
    c.drawString(x, y, text)

def draw_bullet(x, y, text, size=10, color='#444444', max_width=150*mm):
    c.setFillColor(HexColor(color))
    set_font('SimHei', size)
    c.drawString(x, y, '•')
    # 简单换行
    text = text.replace('\n', ' ')
    if c.stringWidth(text, 'SimHei', size) > max_width:
        # 截断
        while c.stringWidth(text + '...', 'SimHei', size) > max_width and len(text) > 5:
            text = text[:-1]
        text += '...'
    c.drawString(x+6*mm, y, text)

y = PDF_HEIGHT - 20*mm

# ====== 顶部个人信息 ======
c.setFillColor(HexColor(BLUE))
c.rect(0, y-35*mm, W, 35*mm, fill=1, stroke=0)

y_name = y - 14*mm
c.setFillColor(HexColor(WHITE))
set_font('SimHei', 28)
c.drawString(22*mm, y_name, '黄  羽')

set_font('SimHei', 12)
info_y = y_name - 10*mm
c.drawString(22*mm, info_y, '求职意向：软件开发工程师')
c.drawString(100*mm, info_y, '21岁 | 福建')

info_y2 = info_y - 7*mm
c.drawString(22*mm, info_y2, '18505982308 | 2785253749@qq.com')
c.drawString(100*mm, info_y2, '闽南科技学院 · 计算机科学与技术 | 2023.9-2027.6')
c.drawString(22*mm, info_y2 - 7*mm, 'GitHub: github.com/2785253749-wq')

y = y - 42*mm

# ====== 教育背景 ======
y = draw_section_title(y, '教育背景')
draw_text(22*mm, y, '闽南科技学院',  12, '#1a5276', True)
draw_text(75*mm, y, '计算机科学与技术 本科', 10, '#555555')
draw_text(150*mm, y, '2023.09 - 2027.06', 9, GRAY)
y -= 6*mm
draw_bullet(22*mm, y, '核心课程：程序设计基础(C/C++/Java/Python)、Web前端开发、数据结构、数据库原理', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '英语四级，能阅读英文技术文档；具备项目开发与团队协作能力', 9, GRAY)
y -= 12*mm

# ====== 项目经历 ======
y = draw_section_title(y, '项目经历')

# 项目1
draw_text(22*mm, y, 'AI Vocabulary Assistant（AI智能背词助手）', 12, '#1a5276', True)
draw_text(150*mm, y, '2026.06 - 2026.07', 9, GRAY)
y -= 6*mm
draw_bullet(22*mm, y, '基于 DeepSeek 大语言模型的智能英语单词学习 Web 应用，前后端分离架构，线上可访问', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '前端：Next.js 14 + TypeScript + Tailwind CSS；后端：Python Flask + SQLAlchemy；AI：DeepSeek API', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '实现闪卡学习、智能错词推荐（三因素加权算法）、AI例句/记忆法/学习分析、7天趋势统计等核心功能', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '16个RESTful API接口、5张数据表、14个页面路由；部署于Vercel + Render，GitHub管理版本', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '收获：掌握大模型API调用与Prompt Engineering，熟悉全栈开发流程与生产环境部署', 9, GRAY)
y -= 10*mm

# 项目2
draw_text(22*mm, y, '新闻小程序', 12, '#1a5276', True)
draw_text(150*mm, y, '2025.09 - 2025.12', 9, GRAY)
y -= 6*mm
draw_bullet(22*mm, y, '技术：uni-app + 微信云开发，实现跨端适配', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '功能：新闻列表/详情、分类筛选、收藏分享、数据缓存', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '收获：掌握uni-app组件封装、云开发数据交互与小程序性能优化', 9, GRAY)
y -= 10*mm

# 项目3
draw_text(22*mm, y, '学生成绩管理系统', 12, '#1a5276', True)
draw_text(150*mm, y, '2025.03 - 2025.06', 9, GRAY)
y -= 6*mm
draw_bullet(22*mm, y, '技术：Python + MySQL，实现学生信息、成绩的增删改查与Excel报表导出', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '收获：掌握数据库CRUD操作、Python数据处理与报表生成', 9, GRAY)
y -= 14*mm

# ====== 专业技能 ======
y = draw_section_title(y, '专业技能')

skills = [
    ('编程语言', '熟练使用 Python、Java，掌握 C/C++、JavaScript/TypeScript'),
    ('前端技术', 'Next.js 14、React、Tailwind CSS、Vue.js、HTML/CSS、Axios'),
    ('后端技术', 'Flask、SQLAlchemy、RESTful API 设计、JWT 认证'),
    ('数据库', 'MySQL、SQLite、PostgreSQL，熟练编写 SQL 查询'),
    ('AI 相关', 'DeepSeek API 调用、Prompt Engineering、AI 应用集成'),
    ('工具能力', 'Git 版本控制、VSCode、npm/pip、Postman、Vercel/Render 部署'),
]
for label, text in skills:
    draw_text(22*mm, y, f'{label}：', 10, '#1a5276', True)
    draw_text(50*mm, y, text, 9, GRAY)
    y -= 5.5*mm
y -= 10*mm

# ====== 自我评价 ======
y = draw_section_title(y, '自我评价')
draw_bullet(22*mm, y, '计算机专业在读，具备扎实的专业基础，对全栈开发与AI应用有浓厚兴趣，已完成3个完整项目', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '能独立完成从前端到后端到部署的完整开发流程，熟悉 RESTful API 设计与数据库建模', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '学习能力强，能快速上手新技术（如本项目从零学习 Next.js + Flask + DeepSeek 并在2周内交付）', 9, GRAY)
y -= 5*mm
draw_bullet(22*mm, y, '性格严谨细致，注重代码规范和工程化习惯；团队协作意识强，能积极配合完成任务', 9, GRAY)

c.save()
print(f'简历已生成: {OUTPUT}')
