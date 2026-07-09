import os

STRIPE_DEBUG = os.getenv("STRIPE_DEBUG", "True") == "True"
STRIPE_TEST_PUBLISHABLE_KEY = os.getenv("STRIPE_TEST_PUBLISHABLE_KEY", "")
STRIPE_TEST_SECRET_KEY = os.getenv("STRIPE_TEST_SECRET_KEY", "")
STRIPE_PROD_PUBLISHABLE_KEY = os.getenv("STRIPE_PROD_PUBLISHABLE_KEY", "")
STRIPE_PROD_SECRET_KEY = os.getenv("STRIPE_PROD_SECRET_KEY", "")
STRIPE_WEBHOOK_KEY = os.getenv("STRIPE_WEBHOOK_KEY")

if STRIPE_DEBUG:
    STRIPE_PUBLISHABLE_KEY = STRIPE_TEST_PUBLISHABLE_KEY
    STRIPE_SECRET_KEY = STRIPE_TEST_SECRET_KEY
else:
    STRIPE_PUBLISHABLE_KEY = STRIPE_PROD_PUBLISHABLE_KEY
    STRIPE_SECRET_KEY = STRIPE_PROD_SECRET_KEY


CHECKOUT_SUCCESS_URL = os.getenv("CHECKOUT_SUCCESS_URL")

ECART_API_ID = os.getenv("ECART_API_ID", "")
PAYSTACK_SECRET = os.getenv("PAYSTACK_SECRET")

# Nomba platform credentials. Sub owns the Nomba relationship;
# individual organizations no longer supply their own keys.
LIVE_NOMBA_BASE_URL = os.getenv("LIVE_NOMBA_BASE_URL", "https://api.nomba.com")
LIVE_NOMBA_CLIENT_ID = os.getenv("LIVE_NOMBA_CLIENT_ID", "")
LIVE_NOMBA_CLIENT_SECRET = os.getenv("LIVE_NOMBA_CLIENT_SECRET", "")
LIVE_NOMBA_ACCOUNT_ID = os.getenv("LIVE_NOMBA_ACCOUNT_ID", "")

SANDBOX_NOMBA_BASE_URL = os.getenv("SANDBOX_NOMBA_BASE_URL", "https://sandbox.nomba.com")
SANDBOX_NOMBA_CLIENT_ID = os.getenv("SANDBOX_NOMBA_CLIENT_ID", "")
SANDBOX_NOMBA_CLIENT_SECRET = os.getenv("SANDBOX_NOMBA_CLIENT_SECRET", "")
SANDBOX_NOMBA_ACCOUNT_ID = os.getenv("SANDBOX_NOMBA_ACCOUNT_ID", "")

NOMBA_ENV=os.getenv("NOMBA_ENV", "sandbox").lower()
if NOMBA_ENV == "live":
    NOMBA_BASE_URL = LIVE_NOMBA_BASE_URL
    NOMBA_CLIENT_ID = LIVE_NOMBA_CLIENT_ID
    NOMBA_CLIENT_SECRET = LIVE_NOMBA_CLIENT_SECRET
    NOMBA_ACCOUNT_ID = LIVE_NOMBA_ACCOUNT_ID
else:
    NOMBA_BASE_URL = SANDBOX_NOMBA_BASE_URL
    NOMBA_CLIENT_ID = SANDBOX_NOMBA_CLIENT_ID
    NOMBA_CLIENT_SECRET = SANDBOX_NOMBA_CLIENT_SECRET
    NOMBA_ACCOUNT_ID = SANDBOX_NOMBA_ACCOUNT_ID

# Nomba webhook receiver configuration.
NOMBA_WEBHOOK_IPS = os.getenv("NOMBA_WEBHOOK_IPS", "").split(",")
NOMBA_WEBHOOK_IPS = [ip.strip() for ip in NOMBA_WEBHOOK_IPS if ip.strip()]

NOMBA_WEBHOOK_SECRET = os.getenv("NOMBA_WEBHOOK_SECRET", "NombaHackathon2026")
NOMBA_WEBHOOK_SIGNATURE= os.getenv("NOMBA_WEBHOOK_SIGNATURE", "nomba-signature")
# 🔐 Webhook signing key: NombaHackathon2026

#   We sign every webhook we forward to you. Use this key to verify the

#   `nomba-signature` header so you know it genuinely came from Nomba.

#   Validation steps: https://developer.nomba.com/docs/api-basics/webhook