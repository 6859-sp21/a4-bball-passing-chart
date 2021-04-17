
# A4 - Basketball Passing Chart #
#### Bhavik Nagda & Samir Wadhwania  ####

## Background ##

Data analytics in basketball has grown tremendously over the past few decades as coaches seek to optimize each and every single possession of the game. The NBA as an organization recognized the need for better data for teams to use, and began recording and publishing precise player and ball tracking data in 2014. This immediately led to new trends in how the game of basketball is visualized, the most famous of which is the now ubiquitous hexagonal shot chart by Kirk Goldsberry:

![](https://fadeawayworld.net/wp-content/uploads/2020/01/golsberry.jpg?x31826)

Most visualizations focus on shooting (appropriately so since that is how you win the game). If we want to focus on actual ball movement throughout a game, however, the closest visualizations that are popular now focus on *assists* - a small subset of the number of passes that take place during a single game. We wanted to use the tracking data gathered by the NBA to look at **all** passes that might occur throughout the game. This led us to create our Basketball Passing Chart.

## Design Rationale ##

### Heatmap ###

The first decision was how we wanted to represent our passes. We knew we wanted to have some sort of *geographic* representation: the Goldsberry shot charts immediately grab your attention because you know what a basketball court looks like and you can visually navigate around the court. We wanted something similar, but needed to figure out how to encode something that had **two** details: a source and a destination. Our original ideas involved lines, as shown below. Either displaying courts side by side or with a transition between source and destination: 

![](https://lh3.googleusercontent.com/SVqWxUVa_UoBcgVWMQjxX-UkJt_p50V4rPd4s5-n3FoK7nBLdQSL4g1bNZ6_kfDnVDPOAsd6rwt95yfbpiwrCvNacm9wmeQfiApaOZEk2QY3-fRSgViG_F2SCkbxNzLqQzMNFMp-zokqeuMRRP0gBtBEHp3EtP76LAGvLqJ6OtzAfukgy_04wlXdUpJqCl7LxsNFcfZIe46ZVxqew1gMT4vVvnc7LFuSgOxI4W6G7jK2Yk9epmah-xwBVDkO94De2Kz93lJ5AZBBrh26sAvR67v_g3w3T0Q6_CJ6y0J3VwZxwZWRtW-jIHw08W2Fyg-roXZLW3Mx7DdFaKeeMJGi4TmqIj-_KHNvU-LTtrSBIEcBqmbNssOGO2XRLJdbe9nHVasp_e-lEsoNNN3IZkReORFan1DZ8rfLsN85YBI-itW4Sdcs7JaoUY1Y4ythryDc0Pinxkztoaj-q6c19kmECKWN-Yog202aECZ0Xusxd0jMgzuO8PtgexICdbtMmSoj9tQmwlbvrNW2D1eSG08kyP48syFarXqK-p4FQr7ws0p9ZT-kXvsrIhYduvAkp2IdrXv0JRmMFxslqQ9ourt9GkWWxfkgafm6zb3Zn76jvWOIH_HGujwsKd47BlLl9t2s8nPRfv2rFkmtu-ihoNn5GlKeHNyrOxBYkhVRn51t6WsjCnr5MVAFHU08256NtqCARb14N34tU9p5rm1G-rDkuhTL=w2054-h1542-no?authuser=0)
![](https://lh3.googleusercontent.com/ip-PiwH9-vRCnUIUx0ZKBa3pd5adC1F6A0_WY4oDuy1Hs6rAX5N7vRIOGn_Wtz5izcas52SsoV9YW_olINxSBn-2_DE86Ixm6NcmUCX3MB4JVEUKITx8sb1NN9xSVOrIaQZoJ1MnKWOQXshturm5JJT0019CLqDQqIBevmZfkpYbUm8CfqEosu0BKLfIdtT2MIeAHZHq25BqWs90OdqxDF7xoAS-bOuvdmgX9D7UYb9iYRlbY0laxhGjv0ySL0DCIZQlQYEpnBNCO1pz5vk5Q_71PeFJNa7KLe7HNJySeEoaIXGj5h8NwTYPcJMFx5JlGwLx9ZT_UihvW8svMPChDztxfCg8dGU_o3FH2gvYUyh6MRbNs7qVE7v_f6rzSWQZYsUIQUvvCw_8e2Aa55FNGEeVb6xRsDzZwST9KaKXIyLpnhI8iD4oNO22ZEdU5a7THvhOF6Y-4UwLkQqApOULHeXM_IARS_wr2NeEBW7txwwYisDp74vRI_yxv-5FirH38yUppEapI37u3mlZUDaayXlEaSZLpYyLaLN0jR60ocgGHOcZZBE9RikEc80wi054nF67tmUqDH4QOHW5B5Mp7YV141PUeUlH9skqFqXkjapXrXxrSFPQnLhP7dC5CmKi7dRV4IgGrkBRbDgP0uFCIKGwZNGppjGCoxZp66LpE2puKvBlew2b_8Qdr3xSSwjljQ9ZI2FfTL2CZ1KezRrDnFn_=w2054-h1542-no?authuser=0)To begin, we started plotting out the data we had from the NBA...
![](https://lh3.googleusercontent.com/_0yRXdFBh_GkqQrML_aVxx7p_R-IMqxQ9fINxjiPNJyOUFkyvO3QOzkUE6GGql50gLlNpECo1lNJjxv4ARb1F4-JZ6KwGwBGYcByu9cKFpTNmpv3k7JDtJ-T5r2-Rv_LhH94iAfXUQISQ73JPsFUsDBrhSuM3FbRPwjyTW-wWpdmf7WQiVy2FVykajYwQmE6Qpdm9OlVRgK7GTbklcplf-Vtz0r4N_5Og1qKIGT-y7ijiZL3Ni1FZW13p8Dcqxs_K8EW_pHbhdJit3tXP59S8n43EDvQv3F65Ne_9vEP19fScjl00MY_ZxBtyMn5JRevURBbBpyvjS8jWIIiHy1xaVP-8tY_cpm7cbvxZMHfmrfk9c3seulZPl8DnlNYzb2CYevfSuLEjaN3aWXMsMrL3sM11Do4sx6nazarrumQ5S4ukIOT13H36dMasoZSPW8TuuPm_lIBXa9AH8aSab7swHt_XmKyQhBWJNpwJIxxqaxBbEq53k-iktk762fOTljbMLytHjF348PzHQPtZrf9yQFrHm2YpqKeQpdEH6a7Vbg2-211WGZowVf9bYHSSOwomGIG3Df1jRdSrYnSvIPL-8CYIfh5Mi79zvOIoCzuv_V6-f91UMHgyNBvaAUp_u9bn7-HPewtgkxpPuU3BJJwWoPCLpbDd7jUILzhc83fIrqPsrgloUEU9Z3e8UTYP3yG6XZSvF0Cn87vUGXlwB4i_gaF=w383-h249-no?authuser=0)

We realized after playing around with the data that we had that this was going to be infeasible: too much information! Overlaying more than just a few lines was too chaotic to get any sort of useful information. But we liked the idea of *clicking* a point on the court and getting information of out of it, so we settled on our final design: a heatmap to represent frequency.

This allows us to present two types of information: source data, and destination data. The default presentation would be the distribution of where passes are made *from*, and clicking on (interacting with) the visualization would allow you to see data specific for that point: where do balls travel *to* from that source location.


### Court ###

Most basketball court visualizations are half-court representations because teams switch sides, and there is no real significance as to which side of the court belongs to whom. All offense takes place on one side of the court, the specific side depending on the team and quarter of the game. As a result, all data is collapsed onto one half-court and represented as such. 

We, however, wanted to make full use of our tracking data. Plays regularly begin on one side of the court and make their way to the offensive side. As a result, we do have meaningful data on the "back half" of the court: passes up the court, around defenders trying to full court press, and in-bounding from under the basket. As a result, we decided to keep the full court design and represent our data in full.

An important design decision was how the binning of locations would work. 1 ft x 1ft boxes gave the most detail, but proved to be too fine -- the buckets needed to be big enough to have enough passes from/to those locations otherwise the display would be very sparse. A 2ft x 2ft box worked well, and was also a good representation for how much space an NBA player might take on the court.

### Shot Chart Percentage ###

When a player has a ball, they can really only do one of three things: dribble, pass, or shoot the ball. As such, we wanted to augment our passing data with useful context by showing a breakdown of shooting percentages by team. Basketball, at the end of the day, is about getting the ball in the basket. This data can also help understand why the passing data might make sense: are players passing *into* high percentage shot locations? Are players passing *out of* low percentage shot locations? 

We represented this with a bar chart next to our court visualization. Clicking a location on the court populates the bar chart with data for that specific point. 

### Animation / Interaction ###

Since we settled on a heatmap representation, the animation technique proved to be quite simple -- a fade transition makes it clear that the data being presented is changing upon clicking a point on the court. The source point is filled in to make clear where the pass is starting (or, if no point is filled in, that you're looking at the source data). 

Our initial design did not make it clear that the visualization was interactive at all, so we added a border around each cell to make clear that the court was composed of individual cells. Highlighting them (and producing a tooltip) while moused over makes it clear to a user very quickly that the visualization can be interacted with.

The bar chart redraws when a new location is clicked on the court. We thought about having the bars reorganize based on shooting percentage, but believed it to be too chaotic / unnecessary. It is quick enough to discern which teams shoot better than others from a specific point, and does not distract you with many bars moving around / on top of each other on every click.

## Development Process ##

Work was mostly split up between data side and visualization side. Samir focused on the data and Bhavik focused on visualization.

### Data Cleaning ###

The tracking data from the NBA required several steps to clean and process. Several hours went just into fine-tuning an algorithm to cycle through each play that we had data for and extract passes. Here are a few images representing steps along the way:

![](https://lh3.googleusercontent.com/iB7LlGm9-y2N4wzfqlHs9oIH1bUzy25dj2w9tZqp7cbtu-ue8AK5QPDkj-wjdESzirlPDw1qrnY-0Fbw6MW8wgJRwZ2a6Yrt3SV-Jk0KHl4NPWEUWZp_fFjGixvQGKYeb9Romy2TMMCZAne_hP6yqcbzAM7TiRYGLw8UM7vTc4ICLfsM0DTbzDZnb7g1GJk5n7xI2xIQ05j_Fgc2iEEIluKrlfbf_T_bLHyVCFFeZlC2-PZVTzwvqe3bK2arewO-75y9ID9r5iUhX3I10n9aWCieTuKViq7_nEQ8QMOEtaITC9ozX_yo_dU1I_TWCHwcOsHo_fVGr4SpDlwripszftBXDGd_Uc4gnd0miqdUdmkCFRz_BOxh3C8vqSGBX6EOfMgNdEKvnMneXlsQFdqhdAfwzHcmS1ybUcm1Hnv8czLlZOKda_5qCMg0jPfOL2584icY-u2P-SoMfPDC7NAi4-j48fLQ96xRJDrJvl5hGbHYPU-x4Id2huZQVRG3BjrgTvuVX7m-Th2Da9RcRqKGN2vz9j6m_XFdS5r_RjyPHZJPNtf7t3X4Jyrq9gWjAtHtFCBddWas0fvNwHOpyN6duumdhjj2TxeWQnxvk1bNq5sYp0ZeYPh7S3U7IXsLRzBuNOBsUQ85umtmNz_QVR9XMyuUqnn-3BHO3qmaQelF2GaKaATS82aBxfo2r0wPX5C4uiOIPLIpqpwQ-9qDhOTIpHKS=w441-h297-no?authuser=0)
![](https://lh3.googleusercontent.com/nBIPrQP98W9pSvarY19fsdiiSygIOK21B4TzSCFq1GSn0fHyZ8f49KyyWE-Oc3nKlrMwOFp-6v_Sd0QZu2J82Vk0o1lE-kTw2DfvE2h2-qMviYuvH7mRSTUrhv_2-5Y7Mmvg6DOLxQ3m3g6xXs6oysomIfV3MQq-295OjAhSnGaYe624g7NQtUWW3TJ2aNtmOv_RD4HjCyc576tHhWQ-_s1Hsmj5QZ2yBRpfsPMT_74-jBO0qPTMx75WYydUo7ChG-PE0e0UBJnA87UrSs2IRBN1fjjDyl7kxzX00csg1SHZls4FP6kAIZwKNkxoN3ThVYlW9xvTSXhbNHTlABIbLe2mI3oU0LRhpcW2YJ3Qr0FIiWuA-UMHFQwi8fBk-192ktvW96fgFYSnRcPUN_CTlxY_2FWyHDzsDhY67cfPJXziAmiMvndQKOAOZsyYr4VT1OVTPRp3chGTWeKmwOLI1pZlA8O6jxRU2ZbnWOA9trNn_4bkt-HCutDE-zOmSZTXD5Gsj9cUphVswSFfJtBmqIKI3iqYtFDYks8Uz6t3i-xTm2U_wTVSydSeZswIFyt1O6O5DMLXqDpgryxK88fX5FuZf4__CKwQ5XTijHA-2x9mlEX6qer2NvW6GFx2WApH26X-znBrRa5XmISiBeXeWxlU2uW9F2hd94m8DmqjNNIPhDJjSY3WWJ3gSaLotJ3IxfoMbeg87AXYzJ_p0_zaCJwQ=w441-h297-no?authuser=0)
![](https://lh3.googleusercontent.com/T6P15KAcNx9FP1FipywZAiPpR0JOTxqXQbS5zpHHRGGEOMKedkgNb9XgWNNYvUEqKk3lLI54K9FnY-R_N-HOQ_fk0_8oHwW3voL0wTwUqFsOHlgGHL0nVEEVduNkEjtqTGO_d0bIOF6Y-AN-1s9zokIfoPADRlc5-4iQ8759MvhRRY4Ei710uofRHVYc2OxoJCdqaHgBXR-CToSCeMCnfxuNvQFM_V5D5RhjUXCYB589bl0mD-7s_s_Mtdla7iEY8pTUbZvdjuYAo7DXLiNAmFJUXqI7SunHL7rpuMbE6P_SZDuNi-bzK12rFyTfloVnheNVxv8cYEgtBfmhX0jYscpJJbSgLXB7gTNJtc5HrWqEkKNdFFCXLsF3rELPSYx4nZSNfUuXAjKx5F7OhgLAGHEQAfrV_qGuo6ut_mNg2wLHCJcXnh96l4e6B-YAcKHDad305zHcFxRLGeQWWxrbaf8X4pVlm4fvlhbrc_tqvrmnraXh1bsnjrwnJ1KNmuTA4WZS0yKeebbfePh2ozQaoWEg8YcXSV6IJd66RkZS-7xZU5ThUss5vpQSmCEL52Az-TMxEL2epv1PBY3FCven8xWpcZlgewDrvsBDUPex4a-j6L5tVpTMuUKCBNxTblRWiVrg6BxG7ufyruUDZFxpmdAM-b7R1LfupwlduuJgktbJai6RAxz-C6L58H1gqAITG4InlDCO_a3Zca7h_KgJDPuK=w441-h297-no?authuser=0)
For the shot percentage data, we similarly consolidated data from every shot attempted and made in the 2015-2016 season. This allowed us to preprocess the data: binning by location and calculating shot percentages by team. 

While this was mostly done by Samir, Bhavik also contributed to cleaning the shot percentage data and formatting for JS. 

***Data Sources:***
* [NBA 2015-2016 Tracking Data](https://github.com/sealneaward/nba-movement-data) hosted on GitHub
* [NBA API Package](https://github.com/swar/nba_api) to download all shot data by season

### Visualization ###

The first step was to create the basketball court in JS. Initially, we made a half court chart to allow us to play around with whatever data we had. From that point on, the full court design was added, a bar chart next to the court, and title and text to explain the visualization. 

After implementing the basic functionality, effort was focused on refining design points such as the tooltip, animation specifics, color grading, and the overall appearance of the webpage. 

While Bhavik primarily handled the development of the visualization, Samir contributed to the tooltip design and animating the heatmap and bar chart.

### Time ###

*Samir:* Cleaning the data was by far the longest part of the process for me. There was a lot of tweaking and manipulating the data to get it preprocessed for the visualization. I probably spent 12 hours total between the passing data and shooting data, and another 3 hours tweaking the visualization. 

*Bhavik:* 