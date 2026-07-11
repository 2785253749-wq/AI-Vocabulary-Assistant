import json
import requests
from flask import current_app
from models.ai_record import AIRecord
from extensions import db


class AIService:
    """DeepSeek API 服务封装"""

    BASE_URL = 'https://api.deepseek.com'

    @staticmethod
    def _api_key():
        key = current_app.config.get('DEEPSEEK_API_KEY', '')
        if not key:
            raise ValueError('DEEPSEEK_API_KEY未配置')
        return key

    @staticmethod
    def _call(prompt: str) -> str:
        """统一API调用 — 超时30秒"""
        try:
            resp = requests.post(
                f'{AIService.BASE_URL}/chat/completions',
                headers={
                    'Authorization': f'Bearer {AIService._api_key()}',
                    'Content-Type': 'application/json',
                },
                json={
                    'model': 'deepseek-chat',
                    'messages': [{'role': 'user', 'content': prompt}],
                    'temperature': 0.7,
                    'max_tokens': 800,
                },
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.Timeout:
            raise RuntimeError('AI请求超时，请稍后重试')
        except requests.exceptions.HTTPError as e:
            status = e.response.status_code if e.response else 'unknown'
            if status == 401:
                raise RuntimeError('DeepSeek API Key无效，请检查配置')
            if status == 429:
                raise RuntimeError('AI请求过于频繁，请稍后重试')
            raise RuntimeError(f'AI服务异常 (HTTP {status})')
        except requests.exceptions.ConnectionError:
            raise RuntimeError('无法连接AI服务，请检查网络')
        except ValueError:
            raise

    @staticmethod
    def _save_record(user_id: int, word: str, record_type: str, prompt: str, content: str):
        """保存AI调用记录到数据库"""
        try:
            record = AIRecord(
                user_id=user_id,
                word=word,
                type=record_type,
                prompt=prompt,
                content=content,
            )
            db.session.add(record)
            db.session.commit()
        except Exception:
            pass  # 记录失败不影响主流程

    @staticmethod
    def generate_example(user_id: int, word: str, meaning: str) -> dict:
        """
        AI生成例句
        返回: { word, sentence, translation }
        """
        prompt = (
            f'你是一名英语教师，帮助学生准备大学英语四级考试。\n'
            f'请为单词 "{word}"（释义：{meaning}）生成1个简单的英文例句和中文翻译。\n'
            f'要求：例句长度15个单词以内，使用日常场景。\n'
            f'请严格按JSON格式返回，不要包含任何其他文字：\n'
            f'{{"sentence":"...","translation":"..."}}'
        )

        try:
            raw = AIService._call(prompt)
            # 清理可能的markdown包裹
            raw = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            result = json.loads(raw)
            AIService._save_record(user_id, word, 'example', prompt, json.dumps(result))
            return {
                'word': word,
                'sentence': result.get('sentence', ''),
                'translation': result.get('translation', ''),
            }
        except (json.JSONDecodeError, KeyError):
            raise RuntimeError('AI返回格式异常，请重试')

    @staticmethod
    def generate_memory(user_id: int, word: str, meaning: str = '') -> dict:
        """
        AI生成记忆方法（词根词缀 + 联想记忆）
        返回: { root, memory }
        """
        meaning_hint = f'（释义：{meaning}）' if meaning else ''
        prompt = (
            f'你是一名英语词汇记忆专家。请为单词 "{word}"{meaning_hint} 生成记忆方法。\n'
            f'要求：\n'
            f'1. 词根分析：拆解单词的词根、前缀、后缀，并解释含义\n'
            f'2. 联想记忆：提供1个生动有趣的联想记忆方式\n'
            f'请严格按JSON格式返回，不要包含任何其他文字：\n'
            f'{{"root":"词根分析...","memory":"联想记忆..."}}'
        )

        try:
            raw = AIService._call(prompt)
            raw = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            result = json.loads(raw)
            AIService._save_record(user_id, word, 'memory', prompt, json.dumps(result))
            return {
                'word': word,
                'root': result.get('root', ''),
                'memory': result.get('memory', ''),
            }
        except (json.JSONDecodeError, KeyError):
            raise RuntimeError('AI返回格式异常，请重试')

    @staticmethod
    def generate_analysis(user_id: int, stats: dict) -> dict:
        """
        AI学习分析
        stats包含: total_learned, known_count, forgot_count, weak_words
        返回: { analysis }
        """
        prompt = (
            f'你是一名学习分析专家。根据以下数据给出学习建议（不超过150字）。\n'
            f'数据：\n'
            f'- 总学习单词数：{stats.get("total_learned", 0)}\n'
            f'- 认识数量：{stats.get("known_count", 0)}\n'
            f'- 忘记数量：{stats.get("forgot_count", 0)}\n'
            f'- 薄弱单词：{", ".join(stats.get("weak_words", []))}\n'
            f'要求：鼓励性语气，给出具体改进建议。\n'
            f'请严格按JSON格式返回，不要包含任何其他文字：\n'
            f'{{"analysis":"..."}}'
        )

        try:
            raw = AIService._call(prompt)
            raw = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            result = json.loads(raw)
            AIService._save_record(user_id, 'overview', 'analyze', prompt, json.dumps(result))
            return {'analysis': result.get('analysis', '')}
        except (json.JSONDecodeError, KeyError):
            raise RuntimeError('AI返回格式异常，请重试')
