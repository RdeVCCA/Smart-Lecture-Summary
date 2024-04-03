from openai import OpenAI
import os
import nltk
gpt = os.environ.get('CHAT_GPT')
print(gpt)
nltk.download('punkt')

client = OpenAI(api_key=gpt)
test_content = '''
Hi all, welcome back to the last part of economic growth lecture. Okay, so last time we stopped at the consequences of high growth. We didn't really go in depth about the cost and benefits of growth, but of course I did ask you to consider when we think about the impacts of growth, it's not just in terms of the positive and negative, we can also look at it from the perspective of impacts on economy, your different macro gains, and we can also look at the impact on the various economic agents like our consumers, our firms, as well as our government, and when we talk about government of course then we would be looking at your micro goals as well as your macro goals. Okay, so for the next few slides we're going to go in depth into the different benefits and costs of high actual growth. So let's turn to page 15. So for page 15, first the benefits of high growth is that of course higher SOL. So why is that the case? It's because when we look at high actual growth, it means that there is increase in your output and when there's increase in production, it would mean that there's increase in derived demand for labour. Since you need to hire the labour as a factor in code to produce these goods and services and therefore it will lead to increase in wages. So then it would mean that the workers would have higher purchasing power, allowing them to consume more goods and services and therefore this increases their material SOL. With higher income also, at the same tax rates, the government is able to collect more tax revenues and then they can redirect this tax revenue into spending. They can spend in terms of infrastructure to increase the quality of life. So for instance, by building more hospitals and this increases the health or life expectancy of the citizens or the government can use this increase in tax revenue to spend in terms of redistributing to the lower income via transfer such as your GST vouchers or your CPC vouchers and this reduces the income inequality and also it can result in less social unrest, etc, etc. So again, you can link that back to increasing quality of life perhaps and therefore increasing your non-material SOL. The second benefit of high actual growth definitely is higher income and consumption. So why do we say that? It's because when there's high growth in the economy, actually it signifies that the economy is doing well and therefore it would boost the confidence of your consumers and firms alike. They would have a positive outlook of the economy. So for consumers, they may expect a rise in their future income and they might spend more and for firms, they would expect increase in future demand for their output and therefore increase in C and increase in I, it would lead to a rise in their aggregate demand and therefore it would lead to a multiplied increase in the national income via the multiplier effect and with actual growth, it would lead to rise in employment for the same reason we explained earlier, right? Because to produce more goods and services, you will need to hire more factor inputs including labour. The next benefit of high growth is that it reduces the debt and helps the government accumulate results. So what do we mean by that? We know that with high growth, as explained earlier, it would lead to a rise in tax revenue. So in this case, if the government can be more prudent, so perhaps because of rise in employment, the government does not have to give out as much unemployment benefits, it can reduce the government expenditure, this can help the government attain a healthier budget position. Okay, if you are confused here at this point in time, it's okay, you can just note this line of reasoning down because we will go into details as to what the government budget is about exactly when we are doing the unit on fiscal policy subsequently. And when we talk about accumulating results, that's very important, right? Because if you look at the past few years, without results, it would have been very difficult for the government to conduct any form of expansionary policies in order to manage the adverse impacts of COVID-19 without the risk of running greater budget deficits or chalking up substantial debt. Okay, that's why Singapore's government, we are always very financially prudent and we kind of pride ourselves on having a lot of results on rainy days, okay? So if we're able to have a healthier budget position, we do not need to borrow, this also reduces the burden of servicing any possible debt in the future, okay? And this also minimizes any future consumption and more importantly, it reduces the intergeneration transfer of wealth from the future generation to the current generation because you can't be making the future generation spend tax money or rather pay taxes because this debt was chalked up from the current generation. Okay, next we talk about the cost of growth. So we have social and environmental costs, this is quite clear-cut, right? So if higher growth is achieved through afforded income tax rates with little or no benefits trickling down to the poor, then economic growth can lead to widening income inequality, right? So when we look at this point over here, it's this important concept of trickle-down economics, right? So what is trickle-down economics exactly? It is the idea that tax cuts is able to boost growth, reduce unemployment and increase wages. So what the theory says is that if you have tax cuts for the wealthy, for the rich, you allow them to hire more workers, right? So reduce unemployment, then it allows them to pay better wages. So generally we see increase in income for everybody, it allows the rich to invest more, pay them perhaps it can help to further boost economic growth, right? So that's the theory behind trickle-down economics. It means that by helping the rich are able to benefit everyone, not just the rich, okay? But what does... So that's theory, right? But in reality we see a very different kind of situation unfolding. So there are economists who analyze the economic effects of major tax cuts for the rich across five decades in 18 different wealthy nations. And what they found is that tax cuts for the wealthy, it only benefited the rich, okay? It didn't trickle down to the low-income groups. And so we see that in reality, it is more likely that the rich get richer, whereas those in the lower-income groups, they do not really get much benefits, okay? That's why it could potentially increase the income inequality. Okay, next, when we look at high growth, okay, we also need to think about how this high growth is achieved, right? If it's achieved with rapid industrialization, with very poor environmental regulations, it may well lead to a fall in our current non-material SOL, right? Especially if there's water or air pollution. So one example, as shown on your screen over here, is that in South Africa. So you see that while they are going quite rapidly because of various urban industrial mining and agricultural activities that they are doing, and perhaps with lack of sufficient regulation, this has led to a fall in the water quality, and the wetlands being degradated. So we see very high water pollution, perhaps, and like what I mentioned earlier, it might reduce the health of the citizens, and therefore it will lead to a fall in the non-material SOL. And also, if we are looking at how growth is achieved, right, so in developed countries, we won't really see rapid industrialization. In developed countries, it can be more about restructuring to a digital economy, so we can be looking at the impact of digitalization. So like the case in Singapore, so this was published back in 2021. If you look at this, it's about how COVID has exposed our lack of digital inclusion. So we know from the IT revolution, there's a lot of talk about automation, big data, AI, robotization, big data, et cetera, et cetera. Internet of Things, all about digitalization, and actually, it increases the rate of obsolescence of even labor skills. So if you have labor who are not as technologically savvy, right, so if we look at the digitally skilled versus the digitally unskilled, it will actually expand the wage gap between these two, because those who are digitally unskilled, they won't be able to keep up with the new advancements, the new developments, and therefore they will be less in demand, right, and therefore their wages might not go as fast or might not even go at all compared to the digitally skilled. So there could be higher structural unemployment for these workers, and unfortunately, we see this more also in the older generation over here. Right, so next one. Next, we see that with actual growth, right, even though there could be rising income, it does not guarantee rising happiness, okay. So while there might be some positive correlation, right, economic growth, higher income, maybe you can buy more luxury goods, you're happier, but it does not always hold consistently, especially for the already wealthy nations, and that is the idea behind Easterlin paradox. Okay, so this paradox is introduced by an economist called Richard Easterlin back in 1974, and what he found out was that even though during 1940s to 1970s, the US economy expanded quite quickly and significantly in that period, surveys did not really show that the citizens are much more happy, happier, right. So why is that the case? He posits that happiness caused by wealth has a saturation point, so money will only affect the happiness of a country up to a certain point. So why is that the case exactly? It could be because there's higher pressures of competing in a very stressful world, and it could lead to depression or other kind of stress-related illnesses. So again, it might reduce the quality of life, okay, and therefore it would reduce the non-material SOL of the citizens. Another cost of growth could be the foregoing of current consumption. So like I mentioned earlier, it is very important how the faster growth is achieved, right. If the faster growth is achieved via an increase in investments, so there's greater production of capital goods, right, it could mean that there's less resources available to produce the consumer goods, so we are sacrificing the current satisfaction, right, in order for our future satisfaction. So in other words, we are sacrificing our current material SOL, okay, such that perhaps there could be increase in our future material SOL. Another potential cost of growth could be that of the depletion of natural resources, okay. So if we are achieving growth through burning through our non-renewable resources, right, so for instance, if you look at the global primary energy consumption, we rely heavily still on fossil fuels like your coal, oil, and gas, right, this would pose issues to us in the future because this is not sustainable, right. All these, oil, coal, gas, they have a finite supply, they are non-renewable, and once they run out, then what are we going to rely on for our growth subsequently? How can we fuel, right, future production for future consumption for our future generation? That's why there's this idea of how it will impede future economic growth, right, and what can we do, right, instead of depleting natural resources is what was kind of hinted at earlier. So instead of relying on these non-renewable resources, we can look towards alternative energy resources that are cleaner and renewable, so for instance, wind, solar energy, right, and then, yeah, so basically here it seems to be hinting that growth is unsustainable here, right, there will be resource depletion for the future generation. So you can just make a note there. Next, another cost of growth could be conflict with other macro objectives, so if we are looking at achieving actual growth, it can be through the rise in aggregate demand, right, but if your aggregate demand is to rise faster than your AS, then it might lead to demand co-inflation, which is not very desirable for the economy, and you understand why in the next unit. Okay, so again, here's a summary of the various impacts of high actual growth, and I want you to focus on the cost of growth. Ocean and environmental costs we mentioned. Okay, so again, it was hinted that perhaps there could be some water and air pollution, and then there could be widening income inequality, and when we look at depletion of natural resources also, it seems to hint that growth can be unsustainable, or that growth can be non-inclusive, and that points us to our next part, which is undesirable growth. So when we look at undesirable growth in general, it's not just being unsustainable or non-inclusive, growth can be undesirable if it is negative growth we are looking at, or persistently low growth. Okay, so let's look at the first one here. Right, so persistently low is different from negative. When we look at persistently low growth, right, growth is still happening, but at a smaller rate. So we can be looking at the increase in real output at a slowing rate. So on the other hand, when we look at negative growth, it tells us that the real output has fallen. And what are the causes behind persistently low or negative growth? It can be seen from the table that you have, okay? So all these little points here, there's no need for you to memorize. These are just examples. The main idea is really about how we can go about analyzing the causes of growth from the demand point of view or the supply point of view. So for instance, we could be looking at how, you know, there is no growth or negative growth because of a fall in AD, or we could be looking at it in terms of a fall in our SRAS. Alternatively, you can also think about it from the domestic or internal versus the foreign or external factors. Okay, that's why I said there's no need to memorize because you do not know what kind of factors the question will give you. And the reasons would really vary from situation to situation, from economy to economy. Of course, if we look at COVID, COVID is a very strong fall in AD, fall in net exports. COVID is also very clearly an external shock that we are facing. So if you look at page 17 at the bottom, there's this very huge chunk of paragraphs. In summary, we are just looking at how different countries or rather different type of economies, because they are at different stages of development. So the problems that they face, whether it is persistently low or negative growth can be very different as well. So if you look at less developed countries, why they constantly face low growth, maybe perhaps like India, it could be because they lack the know-how and resources to invest. That's the main point. On the other hand, if you are looking at more developed countries, so for instance, like Japan, it's because they have certain structural rigidity in place and that might form certain supply constraints for them. So in summary, this would be relating to the insufficient growth in AS. So it could be hinting at lack of potential growth for the different economies and therefore they might have persistently low or negative growth. Then if you look at what we have at the top, actually the fall in AD and fall in SRAS, they are relating to slow and actual growth. So this slide might look a bit confusing, but let me just summarize. So the main two reasons why there is persistently low or negative growth is because of one thing first, it can be insufficient growth in AS, maybe insufficient potential growth. And the second thing that can be insufficient actual growth. But of course, depending on the question, sometimes the question might ask you to analyze which factor is more important. Is it internal factor or external factor? Then perhaps you will have to structure your answers that way. If the question didn't give you any parameters, like they didn't ask you to analyze whether demand reasons or supply reasons is more important, then you can think about it in terms of lack of potential growth as well as lack of actual growth. All right, so that's it for persistently low. On turn to page 18, let's look at activity 8. So here is a short article about how Singapore fell into recession back in the COVID days. So what is recession exactly? It is referring to two consecutive quarters of negative economic growth, meaning that for two consecutive quarters, the real output has fallen. So you can take some time to attend this activity on your own and see whether you can pick up the relevant determinants or to do your ADAS analysis to explain why Singapore fell into a recession then. Let's go through the answers together. So if you look at the first paragraph, it talks about increased uncertainty, in turn holding back on investment and discretionary spending. So this seems to point at very poor economic outlook, very negative economic outlook or very poor confidence, not just in the firms, that's why there's a foreign investment, but perhaps for the consumers as well. So they might pull back on spending because they might want to save more for rainy day and therefore they would reduce their consumption. If you look at the next paragraph, it talks about weaker than expected external demand. So it could be because you know how COVID affected other countries as well, right? It's worldwide and other countries potentially faced, not potentially, other countries also faced recession. There's a worldwide recession happening. So there could be a fall in foreign income and when there's a fall in foreign income, it will lead to a fall in demand for Singapore's exports. By assuming that Singapore's exports are normal goods and therefore it will lead to a fall in Singapore's export revenue. Next part, there's also this fall in tourist receipts. And taken together, we are looking at how there will be a combined fall in CIX leading to a fall in aggregate demand and therefore it will lead to a multiplied fall in national income due to the reverse multiply effect and that's how we see the fall in our real output. Okay, so take a moment to consider, right? We have fall in C, fall in I, fall in X. Which component, fall in which component will have the greatest impact on Singapore's national income? So only three options are fall in C, fall in I or fall in X. Okay, if you guessed X, you guessed correctly, right? Because Singapore is very small and open, we are very export-oriented or rather we are very reliant on exports for growth. Okay, so the fall in exports will hit us the hardest or will have the greatest impact on our national income. Let's continue. So undesirable growth can also be because that the growth is unsustainable. Okay, so let's recall what is sustainable growth. So for sustainable growth, we will require both actual and potential growth. In other words, we require sustained growth first and as well as no problems of environmental degradation or resource depletion for future generations. So if you have actual plus potential plus lack of environmental degradation or resource depletion for your future generation, you will have sustainable growth. Okay, so why might growth be unsustainable? First thing first, it could be because that your growth is not sustained. Okay, so if you have a rapid growth in AD, meaning that you have very high actual growth but no potential growth, your growth cannot be sustained because then you would face the problem of demand pool inflation and there will be an overheated economy. Right, why might growth be unsustainable? It could also be because of how when the government is pursuing growth, right, and they might do so with very weak environmental protection or uncontrolled growth of motor vehicles or reliance on very polluting fuels or specialization in highly polluting industries. All that might mean that there would be certain environmental degradation or resource depletion for the future generations and therefore growth would be unsustainable. Okay, so again, there's no need for you to really memorize these different reasons. I think more importantly is whether if the extracts give you certain information, whether you can identify that as one that is not environmentally friendly or weak environmental protection, for instance. Okay, then when we talk about non-inclusive growth, so again, let's recap what is inclusive growth first. Inclusive growth refers to when you have both actual and potential growth first, okay, giving you sustained growth plus no worsening of income inequality that would give you your inclusive growth. Okay, so if the economy were to pursue growth without insufficient efforts by the government to redistribute income and wealth or they specialize in certain capital or knowledge or skills or technologies rather than labor-intensive industries, it can lead to very skewed growth. And not all, not the majority of the population will have productive employment opportunities and therefore it might lead to worsening of income inequality and therefore growth might be non-inclusive. And my last slide for economic growth already, so what I've done is that I've looked through the past year E-level questions on growth and you can see a compilation of the hot CSQ questions relating to growth. Okay, hopefully here you can see a very obvious trend that is definitely the idea of sustainable and inclusive growth is increasingly more important and commonly tested. Okay, but as you look at these questions, I also want you to consider what is the question asking you about. So recall at the start of this very unit, I ask that you take these questions into consideration, right? How does the growth look like? How is the growth achieved? And what is the impact of growth on the economy or various economic agents? So when you look at the questions here, of course we know it's very obvious that they are testing you on the topic of economic growth, but you must be a bit more cautious, right? Are we looking at how the growth is achieved, right? Is it through the different measures or are we looking at more specifically the impacts, the benefits and the cost of growth? Alright, so hope this gives you a clearer idea on the topic of economic growth and I'll see you in the next one. Bye-bye! Transcribed by https://otter.ai
'''


def get_summary(lecture_content):
    firstTime = True
    
    length = len(nltk.word_tokenize(lecture_content))
    if length > 3028: #for lectures that exceed 3028 words, split up the words
        prompt_lst = []
        
        print(f"total length of tokens in lecture: {length}") #show how long the lecture is

        #create how many times the lecture is split
        if length % 3028 != 0:
            times = length // 3028 + 1
        else:
            times = length / 3028 
        start = 0
        end = 3028

        for i in range(times):
            prompt_lst.append(lecture_content[start: end])
            start += 3028
            end += 3028

        summary = ''
        for i in range(times):
            if firstTime == False:
                prompt = f"Can you summarise the main ideas of part {i} out of {times} of this lecture, paragraph it, and express it in .md format: "+ prompt_lst[i]
            else:
                prompt = f"Can you summarize the main ideas of part {i} out of {times} of this lecture, paragraph it, and express it in .md format: " + prompt_lst[i]
            firstTime = False
            # prompt = f"Can you summarize the main ideas of part {i} out of {times} of this lecture, paragraph it and highlight important points, express it in .md format: " + prompt_lst[i]

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional essay writer and is good at summarising lectures."},
                    {"role": "user", "content": prompt_lst[i]}
                ],
            )
            summary += response.choices[0].message.content.strip()
        return summary
    else:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional essay writer and is good at summarising lectures."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content.strip()
    
    
result = get_summary(test_content)
print(result)

#after summary is produced, process and reformat summary

#removing possible continuation of lecture that looks weird
strg = result
if 'lecture summary:' in strg.lower():
    idx = strg.lower().index('lecture summary:')
    strg = strg[:idx] + strg[idx + 16:]

split_strg = strg.split('\n\n') #the summary is converted to a list splitted by paragraph

#resend to chatgpt to give a heading for each paragraph
final_summary = "# Lecture Summary: " + "\n"
print('split_strg length', len(split_strg))
for i in range(0, len(split_strg)):
    prompt = f"Give a heading for this"+ split_strg[i]
    response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional essay writer and is good at summarising lectures."},
                    {"role": "user", "content": prompt}
                ],
            )
    final_summary += "### " + response.choices[0].message.content.strip() + "\n"
    final_summary += split_strg[i] + "\n\n"
print(final_summary)

def export_summary(final_summary):
    with open('test_summary.md', 'w') as file:
        file.write(final_summary)

export_summary(result)