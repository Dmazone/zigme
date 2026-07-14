(function () {
  var moods = ["energy", "burnout", "empty", "challenge"];
  var targets = ["family", "friend", "work", "me"];
  var modes = ["senior", "meme"];
  var topics = [
    "health",
    "daily",
    "luck",
    "money",
    "food",
    "sleep",
    "family",
    "friend",
    "work",
    "religion"
  ];
  var openings = [
    "오늘은",
    "이번 복은",
    "아침 기운은",
    "저녁 평안은",
    "새해 덕담은",
    "이번 주 행운은",
    "마음 한켠은",
    "건강 기운은",
    "웃음 복은",
    "묵직한 축복은",
    "작은 기쁨은",
    "가벼운 걱정은",
    "좋은 소식은",
    "밥심 복은",
    "조용한 대박은",
    "느긋한 평안은",
    "묘한 길운은",
    "따뜻한 인사는"
  ];
  var middles = [
    "문 앞에서 신발을 고쳐 신고 들어옵니다",
    "천천히 와도 제 자리는 찾아옵니다",
    "크게 말하지 않아도 마음에 닿습니다",
    "밥상 옆에 조용히 앉아 있습니다",
    "휴대폰 알림처럼 반갑게 울립니다",
    "걱정을 살짝 비켜 세웁니다",
    "기운 없는 어깨를 몰래 받쳐 줍니다",
    "웃음 한 번에 길을 냅니다",
    "모임방까지 정중히 배달됩니다",
    "건강 쪽으로 방향을 틉니다",
    "지갑은 조용히 지키고 마음은 크게 엽니다",
    "늦지 않게 복도를 걸어옵니다",
    "차 한 잔처럼 따뜻하게 남습니다",
    "잠깐 쉬어도 뒤처지지 않게 돕습니다",
    "오늘 할 일을 무탈하게 넘깁니다",
    "좋은 말 한마디로 체면을 세웁니다",
    "복잡한 생각을 접어 서랍에 넣습니다",
    "작은 행운을 크게 보이게 합니다",
    "평범한 하루를 귀하게 만듭니다",
    "어색한 침묵도 덕담으로 바꿉니다"
  ];
  var closings = [
    "부디 무탈히 받으십시오.",
    "엄숙히 축원드립니다.",
    "복은 거절하지 마십시오.",
    "건강부터 챙기십시오.",
    "웃음은 크게 보관하십시오.",
    "마음은 편히 두십시오.",
    "오늘도 점잖게 이기십시오.",
    "걱정은 작게 접으십시오.",
    "좋은 기운만 접수하십시오.",
    "밥은 꼭 든든히 드십시오.",
    "운은 조용히 붙들어 두십시오.",
    "편안한 하루 되십시오.",
    "기운은 아껴 쓰십시오.",
    "복문은 크게 읽으십시오.",
    "체면은 살리고 피곤은 내려놓으십시오.",
    "좋은 소식은 천천히 와도 됩니다."
  ];
  var subtitles = [
    "복 접수 완료",
    "건강 우선",
    "무탈 기원",
    "웃음 배달",
    "대박 예열",
    "평안 저장",
    "기운 보충",
    "덕담 송신",
    "행운 대기",
    "밥심 축복",
    "근엄한 복문",
    "오늘도 무사",
    "조용한 길운",
    "마음 정돈",
    "복도착 알림",
    "소소한 대박",
    "안부 완료",
    "체면 보존"
  ];
  var prompts = [
    "old low resolution digital greeting card flowers birds pixel glitter no text",
    "retro korean greeting card roses sparrows gold glitter no text",
    "vintage family ecard chrysanthemums bird pixel sparkle no text",
    "low resolution holiday card flowers dove warm yellow red no text",
    "old mobile greeting card floral border tiny bird glitter no text",
    "pixelated senior greeting card flowers lucky bird cream yellow no text"
  ];
  var out = [];
  for (var a = 0; a < openings.length; a++) {
    for (var b = 0; b < middles.length; b++) {
      for (var c = 0; c < closings.length; c++) {
        for (var d = 0; d < subtitles.length; d++) {
          var n = out.length;
          var aud = modes[n % modes.length];
          out.push({
            a: aud,
            m: moods[(a + b + n) % moods.length],
            t: targets[(b + c + n) % targets.length],
            o: topics[(c + d + n) % topics.length],
            q: openings[a] + " " + middles[b] + ". " + closings[c],
            s: subtitles[d],
            prompt: prompts[n % prompts.length]
          });
        }
      }
    }
  }
  window.ZIGME_PHRASE_BANK = out;
  window.ZIGME_PHRASE_BANK_COUNT = out.length;
})();
