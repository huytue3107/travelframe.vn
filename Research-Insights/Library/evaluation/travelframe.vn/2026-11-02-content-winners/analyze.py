"""Offline analysis of the preserved Meta snapshot. No network or credentials."""
from pathlib import Path
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import csv
import importlib.util
import json
import statistics

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[4]
spec = importlib.util.spec_from_file_location('channel_metrics', PROJECT / '.agents/skills/channel-evaluation/scripts/channel_metrics.py')
cm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cm)
NOW = datetime.fromisoformat('2026-11-02T11:01:49+07:00')
ICT = ZoneInfo('Asia/Ho_Chi_Minh')
src = json.loads((ROOT / 'source-posts.json').read_text())
comments = json.loads((ROOT / 'comment-evidence.json').read_text())
assert len({p['id'] for p in src['instagram']}) == len(src['instagram'])

def local_time(p):
    return datetime.fromisoformat(p['timestamp']).astimezone(ICT)

def normalized(posts):
    return [{'id':p['id'], 'shortCode':p['permalink'].rstrip('/').split('/')[-1],
             'url':p['permalink'], 'type':{'VIDEO':'Video','IMAGE':'Image','CAROUSEL_ALBUM':'Sidecar'}[p['media_type']],
             'timestamp':p['timestamp'], 'likesCount':p.get('like_count'),
             'commentsCount':p.get('comments_count'), 'caption':p.get('caption')}
            for p in posts]

def stats(posts):
    cm.NOW = NOW
    rows, missing = cm.build_rows(normalized(posts), 595)
    cm.rel_er_fixup(rows)
    s = cm.channel_stats(rows, 595)
    s['median_engagement'] = statistics.median(r['engagement'] for r in rows) if rows else None
    return s

october = [p for p in src['instagram'] if local_time(p).strftime('%Y-%m') == '2026-10']
september = [p for p in src['instagram'] if local_time(p).strftime('%Y-%m') == '2026-09']
videos = [p for p in october if p['media_type'] == 'VIDEO']
mature = [p for p in videos if NOW - local_time(p) >= timedelta(hours=72)]
baseline = stats(mature)['median_engagement']
seven_days = [p for p in videos if NOW - local_time(p) >= timedelta(days=7)]
base7 = stats(seven_days)['median_engagement']
ids_by_series = {
  'Vietnamese practical phrases': ['18117523631071005','18138430624715706','18030709367908870','18090085205676842','18124605712926786','18086863082300412','18341820118256635','17987156576880157','18146779159600913','18086455706311861','17885926743687529','18569801488076978'],
  'Food and cafe discovery (curated examples, not exhaustive)': ['18114014786107837','18129130069696217','17955193068031405','17864121744693389','17945664102086205','18034435691892656','18502267930103922','18120778249937807','18013986920761016','18105629447198404'],
  'Hanoi everyday walk (curated examples, not exhaustive)': ['18126343265496473','18107485910212911','17925895557203457','18415203073091440','17857826808697182'],
}
ranked=[]
for p in sorted(mature,key=lambda p:p.get('like_count',0)+p.get('comments_count',0),reverse=True):
    e=p.get('like_count',0)+p.get('comments_count',0)
    ranked.append({'id':p['id'],'date_ict':local_time(p).isoformat(),'url':p['permalink'],
                   'caption':p.get('caption'), 'likes':p.get('like_count'), 'comments':p.get('comments_count'),
                   'engagement':e,'engagement_lift':round(e/baseline,2),
                   'lift_vs_7day_baseline':round(e/base7,2),
                   'age_hours':round((NOW-local_time(p)).total_seconds()/3600,1)})
series=[]
for label, ids in ids_by_series.items():
    found=[p for p in mature if p['id'] in ids]
    series.append({'series':label,'selected_ids':ids,'n_mature':len(found),
                   'median_engagement':stats(found)['median_engagement'],
                   'n_ge_2x_baseline':sum((p.get('like_count',0)+p.get('comments_count',0))>=2*baseline for p in found)})
comment_counts=[]
for p in comments['posts']:
    audience=[c for c in p['comments'] if not c['from_page']]
    comment_counts.append({'url':p['url'],'returned_comments':len(p['comments']),
       'audience_comments':len(audience),'page_comments':len(p['comments'])-len(audience),
       'food_keyword_comments':sum(c['keyword']=='FOOD' for c in audience),
       'hanoi_keyword_comments':sum(c['keyword']=='HANOI' for c in audience)})
summary={'as_of':NOW.isoformat(),'primary_window':'2026-10-01 through 2026-10-31 Asia/Ho_Chi_Minh; lifetime counts at capture',
 'instagram_observed_n':len(src['instagram']),'instagram_profile_media_count':203,
 'october':stats(october),'september_reference':stats(september),
 'october_video':stats(videos),'october_video_mature_72h':stats(mature),
 'october_video_7days':stats(seven_days),'series_exploratory':series,
 'facebook_n':len(src['facebook']),'facebook_posts_with_reported_shares':sum('shares' in p for p in src['facebook']),
 'comment_counts':comment_counts,'ranked_mature_reels':ranked,
 'likes_share_top_reel_pct':round(100*max(p.get('like_count',0) for p in videos)/sum(p.get('like_count',0) for p in videos),2),
 'limitations':['Pinned status unavailable; the upstream metric helper defaults missing isPinned to false. No claim of zero pinned posts.',
 'Views/saves/shares per Instagram post unavailable. Main ranking uses likes+comments, including potential seed comments.',
 'Series groups are manually selected exploratory cohorts and cannot establish causal effect.',
 'September posts had more time to accumulate lifetime engagement. Do not treat month differences as equal-age performance change.',
 'Facebook shares missing objects are not zero; no Facebook lift calculated.',
 'Current follows do not represent follower count at publication; ER is not used for recommendations.',
 '201 observed IG media versus profile count 203: complete coverage is not established.']}
(ROOT/'metrics.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
with (ROOT/'ranked-instagram-reels.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=['id','date_ict','url','likes','comments','engagement','engagement_lift','lift_vs_7day_baseline','age_hours'])
    w.writeheader(); w.writerows({k:v for k,v in p.items() if k!='caption'} for p in ranked)
print(json.dumps({k:v for k,v in summary.items() if k not in ['ranked_mature_reels','september_reference','october','october_video','october_video_mature_72h','october_video_7days']},ensure_ascii=False,indent=2))
print('COUNTS',len(october),len(september),len(videos),len(mature),len(seven_days),'BASELINES',baseline,base7)
for p in ranked[:16]:print(p['date_ict'][:10],p['likes'],p['comments'],p['engagement_lift'],p['id'],(p['caption']or'')[:100])
