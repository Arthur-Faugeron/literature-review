import numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
NAVY="#172A3A";TWEED="#6B5744";OLIVE="#3F4A32";CAMEL="#C8AE82";IV="#F5F1E8";HAIR="#C9BCA1"
plt.rcParams.update({"font.family":"STIXGeneral","font.size":8.5,"axes.edgecolor":NAVY,"axes.labelcolor":NAVY,"xtick.color":NAVY,"ytick.color":NAVY,
 "figure.facecolor":IV,"axes.facecolor":IV,"savefig.facecolor":IV,"axes.spines.top":False,"axes.spines.right":False,"axes.linewidth":0.7,
 "grid.color":HAIR,"grid.linewidth":0.4,"legend.frameon":False,"text.color":NAVY,"mathtext.fontset":"stix"})
rng=np.random.default_rng(7)
# 1 time series
n=240;t=np.arange(n)
a=np.cumsum(rng.normal(0.4,2,n));b=np.cumsum(rng.normal(0.2,1.4,n))
fig,ax=plt.subplots(figsize=(6.4,2.8));ax.plot(t,a,color=NAVY,lw=1.3,label="Mock strategy (cumulative return, %)");ax.plot(t,b,color=TWEED,lw=1.3,ls="--",label="Mock benchmark (cumulative return, %)")
ax.fill_between(t[100:130],a[100:130],b[100:130],color=CAMEL,alpha=.4,lw=0)
ax.set_xlabel("Month index (mock sample, 240 months)");ax.set_ylabel("Cumulative return (%)");ax.grid(True);ax.legend(loc="upper left")
plt.tight_layout();plt.savefig("assets/mock_timeseries.png",dpi=300);plt.close()
# 2 scatter+fit
x=rng.normal(0,1,300);y=0.45*x+rng.normal(0,1,300);m,c=np.polyfit(x,y,1)
fig,ax=plt.subplots(figsize=(6.4,2.8));ax.scatter(x,y,s=9,color=NAVY,alpha=.55,lw=0);xs=np.linspace(-3,3,50);ax.plot(xs,m*xs+c,color=TWEED,lw=1.4,label=f"Fitted slope {m:.2f} (mock)")
ax.set_xlabel("Standardised mock predictor");ax.set_ylabel("Mock next-month excess return (%)");ax.grid(True);ax.legend(loc="upper left")
plt.tight_layout();plt.savefig("assets/mock_scatter.png",dpi=300);plt.close()
# 3 bars
lab=["Q1","Q2","Q3","Q4","Q5"];v=[-0.2,0.1,0.35,0.6,0.95];e=[0.25,0.22,0.2,0.24,0.28]
fig,ax=plt.subplots(figsize=(6.4,2.6));ax.bar(lab,v,color=[CAMEL]*4+[NAVY],width=0.55,yerr=e,ecolor=TWEED,capsize=2.5,lw=0)
ax.axhline(0,color=NAVY,lw=0.7);ax.set_xlabel("Mock quintile portfolio");ax.set_ylabel("Mean monthly return (%)");ax.grid(True,axis="y")
plt.tight_layout();plt.savefig("assets/mock_quintiles.png",dpi=300);plt.close()
