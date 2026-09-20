import hashlib
from user_agents import parse

def get_device_type(user_agent_string: str) -> str:
    if not user_agent_string:
        return "Unknown"
    ua = parse(user_agent_string)
    if ua.is_mobile:
        return "Mobile"
    elif ua.is_tablet:
        return "Tablet"
    else:
        return "Desktop"

def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()
