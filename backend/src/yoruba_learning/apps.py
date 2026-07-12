from django.apps import AppConfig
from django.db.models.signals import post_migrate


def populate_vocabulary(sender, **kwargs):
    from src.yoruba_learning.models import Vocabulary

    default_data = [
        # Animals
        {"english": "Dog", "yoruba": "Ajá", "category": "animals", "emoji": "🐶", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/dog_in_yoruba_translation_asdxnz.mp3"},
        {"english": "Elephant", "yoruba": "Erin", "category": "animals", "emoji": "🐘", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/elephant_in_yoruba_translation_yepyuy.mp3"},
        {"english": "Lion", "yoruba": "Kìnìún", "category": "animals", "emoji": "🦁", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/lion_in_yoruba_translation_pagb8n.mp3"},
        {"english": "Rabbit", "yoruba": "Ehoro", "category": "animals", "emoji": "🐰", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/rabbit_in_yoruba_translation_loolof.mp3"},
        {"english": "Cat", "yoruba": "Ológbò", "category": "animals", "emoji": "🐱", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/cat_in_yoruba_translation_njx7mr.mp3"},
        {"english": "Monkey", "yoruba": "Ọ̀bọ", "category": "animals", "emoji": "🐒", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/monkey_in_yoruba_translation_pcfuvz.mp3"},
        {"english": "Snake", "yoruba": "Ejò", "category": "animals", "emoji": "🐍", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813103/snake_in_yoruba_translation_tkasq6.mp3"},
        {"english": "Bird", "yoruba": "Ẹyẹ", "category": "animals", "emoji": "🐦", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/bird_in_yoruba_translation_tocutx.mp3"},
        
        # Colors
        {"english": "Red", "yoruba": "Pupa", "category": "colors", "emoji": "🔴", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/red_in_yoruba_translation_zpu4oo.mp3"},
        {"english": "Black", "yoruba": "Dudu", "category": "colors", "emoji": "⚫", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/black_in_yoruba_translation_dsbvoo.mp3"},
        {"english": "White", "yoruba": "Funfun", "category": "colors", "emoji": "⚪", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813104/white_in_yoruba_translation_uoyrvy.mp3"},
        {"english": "Green", "yoruba": "Ewé", "category": "colors", "emoji": "🟢", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/green_in_yoruba_translation_tn6emp.mp3"},
        {"english": "Blue", "yoruba": "Sánmà/Aró", "category": "colors", "emoji": "🔵", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/blue_in_yoruba_translation_x8ndxu.mp3"},
        {"english": "Yellow", "yoruba": "Yeye", "category": "colors", "emoji": "🟡", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813104/yellow_in_yoruba_translation_rett1m.mp3"},
        
        # Numbers
        {"english": "One", "yoruba": "Oókan", "category": "numbers", "emoji": "1️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/one_in_yoruba_translation_ee77e5.mp3"},
        {"english": "Two", "yoruba": "Eéjì", "category": "numbers", "emoji": "2️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813103/two_in_yoruba_translation_e0myqh.mp3"},
        {"english": "Three", "yoruba": "Eéta", "category": "numbers", "emoji": "3️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813103/three_in_yoruba_translation_tlvarx.mp3"},
        {"english": "Four", "yoruba": "Eẹ́rin", "category": "numbers", "emoji": "4️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/four_in_yoruba_translation_mhm8bb.mp3"},
        {"english": "Five", "yoruba": "Aàrún", "category": "numbers", "emoji": "5️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/five_in_yoruba_translation_voii5g.mp3"},
        {"english": "Six", "yoruba": "Eẹ́fà", "category": "numbers", "emoji": "6️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813104/six_in_yoruba_translation_m0lsml.mp3"},
        {"english": "Seven", "yoruba": "Eéje", "category": "numbers", "emoji": "7️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813104/seven_in_yoruba_translation_ensx6g.mp3"},
        {"english": "Eight", "yoruba": "Eẹ́jọ", "category": "numbers", "emoji": "8️⃣", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/eight_in_yoruba_translation_iu54kz.mp3"},
        
        # Objects
        {"english": "Ball", "yoruba": "Bọ́ọ̀lù", "category": "objects", "emoji": "⚽", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813099/ball_in_yoruba_translation_j6whbl.mp3"},
        {"english": "Book", "yoruba": "Ìwé", "category": "objects", "emoji": "📖", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/book_in_yoruba_translation_n1uz90.mp3"},
        {"english": "Chair", "yoruba": "Àpótí/Àga", "category": "objects", "emoji": "🪑", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/chair_in_yoruba_translation_ao0cod.mp3"},
        {"english": "Cup", "yoruba": "Kọ́ọ̀bù", "category": "objects", "emoji": "🥛", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/cup_in_yoruba_translation_taqajt.mp3"},
        {"english": "Pencil", "yoruba": "Kálámù", "category": "objects", "emoji": "✏️", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813101/pencil_in_yoruba_translation_grwmmb.mp3"},
        {"english": "Key", "yoruba": "Kókóró", "category": "objects", "emoji": "🔑", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813100/key_in_yoruba_translation_argowg.mp3"},
        {"english": "Shoe", "yoruba": "Bàtà", "category": "objects", "emoji": "👟", "audio_url": "https://res.cloudinary.com/dkkcqmyjr/video/upload/v1783813103/shoe_in_yoruba_translation_z4f231.mp3"},
    ]

    for item in default_data:
        Vocabulary.objects.get_or_create(
            english=item["english"],
            category=item["category"],
            defaults={"yoruba": item["yoruba"], "emoji": item["emoji"]},
            audio_url=item.get("audio_url", None)
        )


class YorubaLearningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'src.yoruba_learning'

    def ready(self):
        post_migrate.connect(populate_vocabulary, sender=self)
