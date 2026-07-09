from django.apps import AppConfig
from django.db.models.signals import post_migrate


def populate_vocabulary(sender, **kwargs):
    from src.yoruba_learning.models import Vocabulary

    default_data = [
        # Animals
        {"english": "Dog", "yoruba": "Ajá", "category": "animals", "emoji": "🐶"},
        {"english": "Elephant", "yoruba": "Erin", "category": "animals", "emoji": "🐘"},
        {"english": "Lion", "yoruba": "Kìnìún", "category": "animals", "emoji": "🦁"},
        {"english": "Rabbit", "yoruba": "Ehoro", "category": "animals", "emoji": "🐰"},
        {"english": "Cat", "yoruba": "Ológbò", "category": "animals", "emoji": "🐱"},
        {"english": "Monkey", "yoruba": "Ọ̀bọ", "category": "animals", "emoji": "🐒"},
        {"english": "Snake", "yoruba": "Ejò", "category": "animals", "emoji": "🐍"},
        {"english": "Bird", "yoruba": "Ẹyẹ", "category": "animals", "emoji": "🐦"},
        
        # Colors
        {"english": "Red", "yoruba": "Pupa", "category": "colors", "emoji": "🔴"},
        {"english": "Black", "yoruba": "Dudu", "category": "colors", "emoji": "⚫"},
        {"english": "White", "yoruba": "Funfun", "category": "colors", "emoji": "⚪"},
        {"english": "Green", "yoruba": "Ewé", "category": "colors", "emoji": "🟢"},
        {"english": "Blue", "yoruba": "Sánmà/Aró", "category": "colors", "emoji": "🔵"},
        {"english": "Yellow", "yoruba": "Yeye", "category": "colors", "emoji": "🟡"},
        
        # Numbers
        {"english": "One", "yoruba": "Oókan", "category": "numbers", "emoji": "1️⃣"},
        {"english": "Two", "yoruba": "Eéjì", "category": "numbers", "emoji": "2️⃣"},
        {"english": "Three", "yoruba": "Eéta", "category": "numbers", "emoji": "3️⃣"},
        {"english": "Four", "yoruba": "Eẹ́rin", "category": "numbers", "emoji": "4️⃣"},
        {"english": "Five", "yoruba": "Aàrún", "category": "numbers", "emoji": "5️⃣"},
        {"english": "Six", "yoruba": "Eẹ́fà", "category": "numbers", "emoji": "6️⃣"},
        {"english": "Seven", "yoruba": "Eéje", "category": "numbers", "emoji": "7️⃣"},
        {"english": "Eight", "yoruba": "Eẹ́jọ", "category": "numbers", "emoji": "8️⃣"},
        
        # Objects
        {"english": "Ball", "yoruba": "Bọ́ọ̀lù", "category": "objects", "emoji": "⚽"},
        {"english": "Book", "yoruba": "Ìwé", "category": "objects", "emoji": "📖"},
        {"english": "Chair", "yoruba": "Àpótí/Àga", "category": "objects", "emoji": "🪑"},
        {"english": "Cup", "yoruba": "Kọ́ọ̀bù", "category": "objects", "emoji": "🥛"},
        {"english": "Pencil", "yoruba": "Kálámù", "category": "objects", "emoji": "✏️"},
        {"english": "Key", "yoruba": "Kókóró", "category": "objects", "emoji": "🔑"},
        {"english": "Shoe", "yoruba": "Bàtà", "category": "objects", "emoji": "👟"},
    ]

    for item in default_data:
        Vocabulary.objects.get_or_create(
            english=item["english"],
            category=item["category"],
            defaults={"yoruba": item["yoruba"], "emoji": item["emoji"]}
        )


class YorubaLearningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'src.yoruba_learning'

    def ready(self):
        post_migrate.connect(populate_vocabulary, sender=self)
