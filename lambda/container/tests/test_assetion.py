def test_true_assetion():
    assert True

def test_import():
    from src import app
    assert app.__name__ == 'src.app'

def test_url_call():
    from src import app

    event = {
        "image_url":"https://mediasvc.ancestry.com/v2/image/namespaces/1093/media/1c72fa3a-5355-4ef1-9094-0cb14f24b5d9.jpg?client=trees-mediaservice&imageQuality=hq&maxWidth=1080&maxHeight=1782", 
        "model_selection":"GPFGAN v1.3", 
        "upscale_factor": "2", 
        "channel_multiplier": "2"
        }
    
    context = {}
    
    try:
        response = app.handler(event, context)
    except Exception as e:
        print(e)
        assert False
    
    print(response)
    assert True
