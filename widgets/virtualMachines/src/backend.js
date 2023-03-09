/* eslint-disable no-console, no-process-exit */
// @ts-nocheck File not migrated fully to TS
module.exports = async function(r) {

r.register('get_vm_deployments', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_deployments...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let spireDeployments = [];

    if (_filteredDeploymentParentId!=undefined) 
    {
        console.log("spireDeployments search:");
        _searchParam = _filteredDeploymentParentId;
    }

    //https://cloudify-uat.dhl.com/console/sp/executions?_size=2&_offset=0&deployment_id=xa124ls410033&workflow_id=create_deployment_environment&deployment_id=xa124ls201053



    //https://cloudify-uat.dhl.com/console/sp/searches/deployments?_sort=-created_at&_size=50&_include=id,display_name,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,
    //latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,display_name,labels,site_name,blueprint_id,latest_execution_status,deployment_status,environment_type,latest_execution_total_operations,latest_execution_finished_operations,sub_services_count,sub_services_status,sub_environments_count,sub_environments_status',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {



            spireDeployments = data.items;

            //OK console.log(data.metadata.pagination.total);

            //[{"key":"csys-obj-type","value":"environment", 

            //mock data:

            // let _itemsData = [{
            //     "id": "5408c0be-7e73-44f7-839e-0b6a93bf0105",
            //     "name": "washingtonpost.com",
            //     "os": "Oldrey",
            //     "ip": "213.177.132.181",
            //     "cpus": 40,
            //     "azure_sizes": "Combretaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "17231e31-5f4a-40c6-a467-9f39e94cb3eb",
            //     "ram": 13
            //   }, {
            //     "id": "7a69dd6f-bd93-496d-98e6-d79521ab8589",
            //     "name": "quantcast.com",
            //     "os": "Baston",
            //     "ip": "201.209.153.65",
            //     "cpus": 72,
            //     "azure_sizes": "Ericaceae",
            //     "azure_location": "Panama",
            //     "environment": "PA",
            //     "parent_deployment": "4e9400c9-5e36-4f5b-a9a6-898be9a44de0",
            //     "ram": 120
            //   }, {
            //     "id": "a48c5bb0-570a-4b96-8160-6e212e8a6682",
            //     "name": "tinypic.com",
            //     "os": "Iston",
            //     "ip": "92.217.60.74",
            //     "cpus": 30,
            //     "azure_sizes": "Verrucariaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "10cdfbca-5f8e-429f-84e8-57330d1f816b",
            //     "ram": 123
            //   }, {
            //     "id": "b713be23-41f1-4288-a1ec-b8cc9a8827a5",
            //     "name": "bloglovin.com",
            //     "os": "Richfield",
            //     "ip": "136.127.13.152",
            //     "cpus": 101,
            //     "azure_sizes": "Apiaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "081ca62e-2d14-4254-b1cc-947326dd5e04",
            //     "ram": 54
            //   }, {
            //     "id": "482ad10d-4331-4656-ab9f-282cd338272f",
            //     "name": "deviantart.com",
            //     "os": "Goodrick",
            //     "ip": "147.238.59.205",
            //     "cpus": 14,
            //     "azure_sizes": "Euphorbiaceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "38d8e4be-0e3e-4c97-812d-0c972eeaa789",
            //     "ram": 88
            //   }, {
            //     "id": "106de282-a496-431b-b6e4-b5368e6b0059",
            //     "name": "abc.net.au",
            //     "os": "Jukes",
            //     "ip": "198.73.95.210",
            //     "cpus": 91,
            //     "azure_sizes": "Thelypteridaceae",
            //     "azure_location": "Ukraine",
            //     "environment": "UA",
            //     "parent_deployment": "f6120963-c1e3-4da3-a24d-05f4f89b8468",
            //     "ram": 119
            //   }, {
            //     "id": "1ec3bba9-3082-43e2-b6f5-7dc412f49cca",
            //     "name": "amazon.de",
            //     "os": "Mallinson",
            //     "ip": "78.165.198.8",
            //     "cpus": 106,
            //     "azure_sizes": "Fabaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "c8574dbf-cf64-428d-af20-84e059b5d57d",
            //     "ram": 104
            //   }, {
            //     "id": "a5f49adc-0325-40cf-8ea8-26de9789bc83",
            //     "name": "yahoo.com",
            //     "os": "Duddan",
            //     "ip": "204.105.116.159",
            //     "cpus": 92,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "fcc75552-0a18-4161-957d-9f0b2d8c1463",
            //     "ram": 5
            //   }, {
            //     "id": "d7dca1ef-03cc-4f6d-a1b1-5e67c63e57c9",
            //     "name": "netvibes.com",
            //     "os": "Tower",
            //     "ip": "68.6.79.131",
            //     "cpus": 51,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Poland",
            //     "environment": "PL",
            //     "parent_deployment": "9947cfe1-f205-43d3-9125-a74c434ebd98",
            //     "ram": 86
            //   }, {
            //     "id": "1c7fda29-0540-460b-8d83-a98a158e4532",
            //     "name": "cbsnews.com",
            //     "os": "Janodet",
            //     "ip": "229.54.40.219",
            //     "cpus": 105,
            //     "azure_sizes": "Brassicaceae",
            //     "azure_location": "Malaysia",
            //     "environment": "MY",
            //     "parent_deployment": "f6573753-eca5-4b21-90a0-afdba2768c4a",
            //     "ram": 65
            //   }, {
            //     "id": "2f60903a-4dff-42f5-82fb-aeba0b098187",
            //     "name": "wunderground.com",
            //     "os": "Docksey",
            //     "ip": "232.109.229.97",
            //     "cpus": 103,
            //     "azure_sizes": "Lemnaceae",
            //     "azure_location": "Pakistan",
            //     "environment": "PK",
            //     "parent_deployment": "2138e5f5-1346-4bfb-9dfb-b99259c5d678",
            //     "ram": 17
            //   }, {
            //     "id": "34d63a43-2a34-457e-8fd9-fa57be7ee82c",
            //     "name": "pen.io",
            //     "os": "Huckabe",
            //     "ip": "159.199.13.77",
            //     "cpus": 109,
            //     "azure_sizes": "Crassulaceae",
            //     "azure_location": "Malaysia",
            //     "environment": "MY",
            //     "parent_deployment": "27f39d63-a34b-45fc-b65d-f39e11eabf22",
            //     "ram": 68
            //   }, {
            //     "id": "8108be7c-d295-4721-965f-58ae88511c3b",
            //     "name": "example.com",
            //     "os": "Duckit",
            //     "ip": "29.7.236.159",
            //     "cpus": 39,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "a0ed3bfe-5e19-4963-a642-6b499635aca7",
            //     "ram": 29
            //   }, {
            //     "id": "adf414be-070a-4c22-9e3d-330b5ed2ebae",
            //     "name": "mayoclinic.com",
            //     "os": "Prestland",
            //     "ip": "191.211.137.221",
            //     "cpus": 54,
            //     "azure_sizes": "Ranunculaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "25495df4-ad6c-41bb-8b85-11f0316a9eb5",
            //     "ram": 7
            //   }, {
            //     "id": "77179e2f-59a3-44cc-85d9-feb294c6edfe",
            //     "name": "nbcnews.com",
            //     "os": "Sawl",
            //     "ip": "159.100.129.13",
            //     "cpus": 79,
            //     "azure_sizes": "Fabaceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "e38ad605-191f-4208-ad6b-738b8436da1a",
            //     "ram": 126
            //   }, {
            //     "id": "f14fa438-faf8-47af-9284-742339cff3fc",
            //     "name": "blinklist.com",
            //     "os": "Norcott",
            //     "ip": "42.47.38.34",
            //     "cpus": 110,
            //     "azure_sizes": "Rhamnaceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "08330f41-2efe-45ea-beb5-4fc67b03daaa",
            //     "ram": 79
            //   }, {
            //     "id": "bb459fcd-5e21-400c-9c80-b85e742a9845",
            //     "name": "freewebs.com",
            //     "os": "Jon",
            //     "ip": "237.37.37.12",
            //     "cpus": 47,
            //     "azure_sizes": "Lamiaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "eb1e9a4f-dbff-427a-8a40-cbc9114691b3",
            //     "ram": 15
            //   }, {
            //     "id": "c76c8acd-3c94-4242-967f-481c6772008d",
            //     "name": "storify.com",
            //     "os": "Beahan",
            //     "ip": "236.203.125.219",
            //     "cpus": 90,
            //     "azure_sizes": "Fabaceae",
            //     "azure_location": "Czech Republic",
            //     "environment": "CZ",
            //     "parent_deployment": "a34d1499-4d64-4887-9aa9-d78f61cbec7b",
            //     "ram": 49
            //   }, {
            //     "id": "a3db7c49-d25a-422f-ab0b-e670c4177cfb",
            //     "name": "vk.com",
            //     "os": "Rowlatt",
            //     "ip": "113.209.83.24",
            //     "cpus": 14,
            //     "azure_sizes": "Polygonaceae",
            //     "azure_location": "Albania",
            //     "environment": "AL",
            //     "parent_deployment": "06b0abfb-ebe9-4072-8c3c-dba02fc7c1c9",
            //     "ram": 104
            //   }, {
            //     "id": "5eaa374b-2fe6-4c79-ae94-c0141ae4bf8d",
            //     "name": "tumblr.com",
            //     "os": "Mugg",
            //     "ip": "85.220.38.48",
            //     "cpus": 42,
            //     "azure_sizes": "Fabaceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "0a901f1e-9dce-4638-8232-515bdcfc8467",
            //     "ram": 6
            //   }, {
            //     "id": "76ef5e44-551a-42dc-97ae-2a4bdea1cfa0",
            //     "name": "senate.gov",
            //     "os": "Bridgland",
            //     "ip": "137.52.224.10",
            //     "cpus": 6,
            //     "azure_sizes": "Poaceae",
            //     "azure_location": "Norway",
            //     "environment": "NO",
            //     "parent_deployment": "283c2a49-0196-4ef3-bc9b-78ec1adec9d9",
            //     "ram": 61
            //   }, {
            //     "id": "984dc1a6-c92d-4eba-b2d7-ded5d729160d",
            //     "name": "odnoklassniki.ru",
            //     "os": "Parrin",
            //     "ip": "58.145.50.99",
            //     "cpus": 2,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Sweden",
            //     "environment": "SE",
            //     "parent_deployment": "f077f07a-6748-49bf-8845-b42463d0b883",
            //     "ram": 44
            //   }, {
            //     "id": "94fa5566-c504-46fb-818f-0a27c0ac6b9c",
            //     "name": "about.me",
            //     "os": "Colbert",
            //     "ip": "237.231.104.230",
            //     "cpus": 29,
            //     "azure_sizes": "Dryopteridaceae",
            //     "azure_location": "Sweden",
            //     "environment": "SE",
            //     "parent_deployment": "b48f752f-0669-4879-85d5-ac76cbb52a5b",
            //     "ram": 102
            //   }, {
            //     "id": "25951a55-8616-4b2e-82e7-79fb1440457e",
            //     "name": "multiply.com",
            //     "os": "Gallihawk",
            //     "ip": "171.204.41.68",
            //     "cpus": 9,
            //     "azure_sizes": "Cyperaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "93314bc2-0b7d-487d-8caa-efc2d87c5e0d",
            //     "ram": 39
            //   }, {
            //     "id": "928c9ace-b7fa-4039-a225-c3bbefa70ffc",
            //     "name": "networkadvertising.org",
            //     "os": "Giacomozzo",
            //     "ip": "174.126.56.56",
            //     "cpus": 68,
            //     "azure_sizes": "Liliaceae",
            //     "azure_location": "Guatemala",
            //     "environment": "GT",
            //     "parent_deployment": "050df22b-b648-4fd2-8eec-44f030c279cf",
            //     "ram": 106
            //   }, {
            //     "id": "0f014e9d-9c7a-4d71-936d-fde3f29e13c5",
            //     "name": "nationalgeographic.com",
            //     "os": "Verlander",
            //     "ip": "9.58.121.5",
            //     "cpus": 65,
            //     "azure_sizes": "Arthoniaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "dc069fa0-adab-429e-bb83-234ed2071b17",
            //     "ram": 102
            //   }, {
            //     "id": "71187b64-626c-4c0c-8db4-1176398fc7d2",
            //     "name": "tuttocitta.it",
            //     "os": "McClean",
            //     "ip": "78.20.226.93",
            //     "cpus": 11,
            //     "azure_sizes": "Cucurbitaceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "e7176852-846e-4d00-ad3e-c71847bea6cf",
            //     "ram": 78
            //   }, {
            //     "id": "23eac48e-54e3-43fd-bd1d-94b19452e5a6",
            //     "name": "facebook.com",
            //     "os": "Audritt",
            //     "ip": "164.215.211.65",
            //     "cpus": 43,
            //     "azure_sizes": "Myrtaceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "27214473-887b-410b-9d39-3b9e098458a3",
            //     "ram": 118
            //   }, {
            //     "id": "dad9d1b3-f68d-4a93-8b57-4c40e35ca634",
            //     "name": "yandex.ru",
            //     "os": "Cisneros",
            //     "ip": "77.223.81.179",
            //     "cpus": 34,
            //     "azure_sizes": "Orchidaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "cacf81ef-f76a-4c2f-bc41-2aefb2f55960",
            //     "ram": 63
            //   }, {
            //     "id": "d8be80ec-127b-4c88-8521-dedc39e0741c",
            //     "name": "fda.gov",
            //     "os": "Glendinning",
            //     "ip": "158.251.102.122",
            //     "cpus": 68,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "France",
            //     "environment": "FR",
            //     "parent_deployment": "e1d8cf45-bf63-4c60-ae4e-fb26cfb3f645",
            //     "ram": 59
            //   }, {
            //     "id": "a5c262d6-01a0-4cc9-86bf-1a37db972636",
            //     "name": "tripadvisor.com",
            //     "os": "Woolward",
            //     "ip": "213.62.232.69",
            //     "cpus": 81,
            //     "azure_sizes": "Hippocastanaceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "3add666f-01c2-455a-866d-27968c749ae4",
            //     "ram": 25
            //   }, {
            //     "id": "9be05745-b5b7-4223-9963-bf3fe4ab781b",
            //     "name": "sogou.com",
            //     "os": "Smithe",
            //     "ip": "151.169.53.99",
            //     "cpus": 63,
            //     "azure_sizes": "Chenopodiaceae",
            //     "azure_location": "Poland",
            //     "environment": "PL",
            //     "parent_deployment": "be5d456e-766a-4dbe-9576-ccf555e4f8c6",
            //     "ram": 38
            //   }, {
            //     "id": "d69fd4f5-0229-4871-9839-f8947862339f",
            //     "name": "usnews.com",
            //     "os": "Winspeare",
            //     "ip": "4.92.215.159",
            //     "cpus": 85,
            //     "azure_sizes": "Euphorbiaceae",
            //     "azure_location": "Poland",
            //     "environment": "PL",
            //     "parent_deployment": "eadc3d25-1375-4f74-9fef-4b459e32e4ae",
            //     "ram": 128
            //   }, {
            //     "id": "805d40d4-be8e-4e73-945b-ff8e0247c51e",
            //     "name": "indiegogo.com",
            //     "os": "MacGilmartin",
            //     "ip": "193.68.75.244",
            //     "cpus": 78,
            //     "azure_sizes": "Ranunculaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "649b735f-2c61-4e76-8a45-98a3ff2479f0",
            //     "ram": 39
            //   }, {
            //     "id": "b3ca477f-882f-4e6c-bbfc-89b9969209c8",
            //     "name": "example.com",
            //     "os": "Brolan",
            //     "ip": "243.90.65.206",
            //     "cpus": 103,
            //     "azure_sizes": "Menispermaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "0df6a5a8-7b6f-4b49-ab30-ed1ca972a235",
            //     "ram": 91
            //   }, {
            //     "id": "d1e45576-89f8-4880-81e3-bb7f7d15bb8f",
            //     "name": "netlog.com",
            //     "os": "Aberhart",
            //     "ip": "156.20.2.143",
            //     "cpus": 58,
            //     "azure_sizes": "Pottiaceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "dfc3343a-063f-4667-92d2-151838bd836b",
            //     "ram": 94
            //   }, {
            //     "id": "8aab3b1c-28dc-44bd-bc8f-bbfa34ec45c6",
            //     "name": "sphinn.com",
            //     "os": "Pedden",
            //     "ip": "129.224.106.67",
            //     "cpus": 76,
            //     "azure_sizes": "Lamiaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "8c70de62-3d72-4a31-9630-38b5a2ff3922",
            //     "ram": 18
            //   }, {
            //     "id": "e4873954-9e86-467e-9bee-b7255d2c5b9c",
            //     "name": "cocolog-nifty.com",
            //     "os": "Yezafovich",
            //     "ip": "121.52.134.117",
            //     "cpus": 41,
            //     "azure_sizes": "Brassicaceae",
            //     "azure_location": "Germany",
            //     "environment": "DE",
            //     "parent_deployment": "a6799fb8-ae3e-478d-a5ca-796347cc47e5",
            //     "ram": 21
            //   }, {
            //     "id": "b091596d-5be6-414f-9311-06ae9360565b",
            //     "name": "eepurl.com",
            //     "os": "Dalrymple",
            //     "ip": "139.56.47.82",
            //     "cpus": 57,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "692a2480-192d-4854-8f51-4b15e0af6a8e",
            //     "ram": 27
            //   }, {
            //     "id": "887bb986-7b57-4da7-9eae-aa0e0af36ad8",
            //     "name": "microsoft.com",
            //     "os": "Garnham",
            //     "ip": "88.55.124.222",
            //     "cpus": 59,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "428b260c-bd79-4d9a-86f6-e68575d5b576",
            //     "ram": 19
            //   }, {
            //     "id": "a6042b4f-82a8-4746-b272-b416ca41de9c",
            //     "name": "discuz.net",
            //     "os": "Lasselle",
            //     "ip": "179.52.111.47",
            //     "cpus": 15,
            //     "azure_sizes": "Violaceae",
            //     "azure_location": "Yemen",
            //     "environment": "YE",
            //     "parent_deployment": "7223d82d-9686-4efc-838f-662797553211",
            //     "ram": 71
            //   }, {
            //     "id": "869884f7-1c00-4823-a9cb-ed3f1351c4a1",
            //     "name": "sakura.ne.jp",
            //     "os": "Mortell",
            //     "ip": "132.114.183.167",
            //     "cpus": 99,
            //     "azure_sizes": "Polygonaceae",
            //     "azure_location": "Philippines",
            //     "environment": "PH",
            //     "parent_deployment": "2ef83b5a-4bcd-483f-8b5e-5a4288659a38",
            //     "ram": 93
            //   }, {
            //     "id": "a3273508-7113-479c-b30a-52090bbcfdba",
            //     "name": "sun.com",
            //     "os": "Portriss",
            //     "ip": "13.149.16.20",
            //     "cpus": 19,
            //     "azure_sizes": "Juncaceae",
            //     "azure_location": "Sweden",
            //     "environment": "SE",
            //     "parent_deployment": "592f9445-4c76-43e9-8988-6f1dc41b99fc",
            //     "ram": 58
            //   }, {
            //     "id": "d4d2a912-0fea-4b43-b854-ff68fc54dfac",
            //     "name": "npr.org",
            //     "os": "Burrill",
            //     "ip": "10.135.145.95",
            //     "cpus": 40,
            //     "azure_sizes": "Sapotaceae",
            //     "azure_location": "Bosnia and Herzegovina",
            //     "environment": "BA",
            //     "parent_deployment": "b73b2ecf-d39b-40c1-882d-d107e8ed4e52",
            //     "ram": 11
            //   }, {
            //     "id": "11c2082c-db79-4e32-906a-3a36669ae7f9",
            //     "name": "edublogs.org",
            //     "os": "Grime",
            //     "ip": "54.187.135.176",
            //     "cpus": 43,
            //     "azure_sizes": "Scrophulariaceae",
            //     "azure_location": "Poland",
            //     "environment": "PL",
            //     "parent_deployment": "42eb7ace-b0d9-4bca-9704-84667359ffd7",
            //     "ram": 42
            //   }, {
            //     "id": "da1a001e-7729-4de3-9bf3-fc499014b51b",
            //     "name": "geocities.com",
            //     "os": "Franke",
            //     "ip": "209.64.200.70",
            //     "cpus": 91,
            //     "azure_sizes": "Onagraceae",
            //     "azure_location": "Brazil",
            //     "environment": "BR",
            //     "parent_deployment": "72ffd058-c7be-4ad2-b9b1-c2b6aba814e0",
            //     "ram": 46
            //   }, {
            //     "id": "e03bf4bc-4af2-4cb1-829e-22403b88cca5",
            //     "name": "ucsd.edu",
            //     "os": "Swatman",
            //     "ip": "100.54.100.117",
            //     "cpus": 47,
            //     "azure_sizes": "Physciaceae",
            //     "azure_location": "Japan",
            //     "environment": "JP",
            //     "parent_deployment": "a5d9bf75-5d4e-4434-a3ba-b319d7718c37",
            //     "ram": 63
            //   }, {
            //     "id": "9a4ae9d1-c8e0-4c9c-a570-26b8a44f8c81",
            //     "name": "hostgator.com",
            //     "os": "Loton",
            //     "ip": "65.183.178.28",
            //     "cpus": 110,
            //     "azure_sizes": "Grimmiaceae",
            //     "azure_location": "Egypt",
            //     "environment": "EG",
            //     "parent_deployment": "0be3ed3c-604d-40d5-a3ef-25eb066015df",
            //     "ram": 62
            //   }, {
            //     "id": "aad2ee08-81c6-4074-a288-9d8b8f576603",
            //     "name": "vimeo.com",
            //     "os": "Nassy",
            //     "ip": "228.23.152.126",
            //     "cpus": 28,
            //     "azure_sizes": "Loasaceae",
            //     "azure_location": "France",
            //     "environment": "FR",
            //     "parent_deployment": "615d155b-a269-4a38-b5e5-d31e717fe5e1",
            //     "ram": 23
            //   }, {
            //     "id": "4184c994-0486-488b-9d2e-a63488e64967",
            //     "name": "vkontakte.ru",
            //     "os": "Callaghan",
            //     "ip": "55.104.95.243",
            //     "cpus": 98,
            //     "azure_sizes": "Grimmiaceae",
            //     "azure_location": "Peru",
            //     "environment": "PE",
            //     "parent_deployment": "498235ee-5bcb-438c-a0b8-07ecb4b57281",
            //     "ram": 73
            //   }, {
            //     "id": "182257db-47be-4901-97f7-1b508850ced8",
            //     "name": "symantec.com",
            //     "os": "Eager",
            //     "ip": "23.18.55.22",
            //     "cpus": 59,
            //     "azure_sizes": "Bignoniaceae",
            //     "azure_location": "Slovenia",
            //     "environment": "SI",
            //     "parent_deployment": "17f452ef-5c16-40d0-9b0f-eeee71b5231e",
            //     "ram": 100
            //   }, {
            //     "id": "904374dd-899a-45d9-b301-e144a5d85646",
            //     "name": "washington.edu",
            //     "os": "Vickar",
            //     "ip": "146.213.231.13",
            //     "cpus": 7,
            //     "azure_sizes": "Polygonaceae",
            //     "azure_location": "Japan",
            //     "environment": "JP",
            //     "parent_deployment": "61e9dac4-4f29-4e87-b27a-58cf3f5cbca3",
            //     "ram": 59
            //   }, {
            //     "id": "c11cb157-a45e-451e-9e6e-7df664a7c8e7",
            //     "name": "nyu.edu",
            //     "os": "Bowlands",
            //     "ip": "215.79.234.50",
            //     "cpus": 34,
            //     "azure_sizes": "Solanaceae",
            //     "azure_location": "South Africa",
            //     "environment": "ZA",
            //     "parent_deployment": "0b74d063-c1cc-4ae1-af7a-b86acded02ee",
            //     "ram": 83
            //   }, {
            //     "id": "19f864b5-b252-43bf-bf41-f4286b4ac6b1",
            //     "name": "google.co.uk",
            //     "os": "Beushaw",
            //     "ip": "176.152.86.79",
            //     "cpus": 81,
            //     "azure_sizes": "Leskeaceae",
            //     "azure_location": "Guatemala",
            //     "environment": "GT",
            //     "parent_deployment": "ce28f7a2-3b07-4c28-819d-533e8ba57fa4",
            //     "ram": 85
            //   }, {
            //     "id": "eb91f0c2-5d7c-4d59-8d5e-cce9084f5082",
            //     "name": "creativecommons.org",
            //     "os": "Owen",
            //     "ip": "248.62.33.139",
            //     "cpus": 13,
            //     "azure_sizes": "Papaveraceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "ee4b8528-b4c9-47ac-bf44-b274044bb23c",
            //     "ram": 72
            //   }, {
            //     "id": "8febc40a-8cc3-47fa-8cdb-f90406549ec7",
            //     "name": "mlb.com",
            //     "os": "Flintoft",
            //     "ip": "139.199.73.84",
            //     "cpus": 100,
            //     "azure_sizes": "Rhamnaceae",
            //     "azure_location": "Poland",
            //     "environment": "PL",
            //     "parent_deployment": "4aac3ace-8ef7-41bd-b8b0-c92774446214",
            //     "ram": 127
            //   }, {
            //     "id": "a885d60b-da19-4857-a656-5dfe06fb7383",
            //     "name": "theglobeandmail.com",
            //     "os": "Rosel",
            //     "ip": "150.84.150.246",
            //     "cpus": 56,
            //     "azure_sizes": "Rubiaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "3a3195e0-819d-4034-94dd-955e017da441",
            //     "ram": 30
            //   }, {
            //     "id": "c5b53351-4709-46d9-a7de-6767271f89fe",
            //     "name": "dot.gov",
            //     "os": "Badsey",
            //     "ip": "246.88.255.200",
            //     "cpus": 111,
            //     "azure_sizes": "Arecaceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "06f9de12-3c1e-4673-8422-c3c91ae4d8f5",
            //     "ram": 26
            //   }, {
            //     "id": "3d4c5357-9cbc-405e-9178-bfa10e4b29ac",
            //     "name": "wikipedia.org",
            //     "os": "Standrin",
            //     "ip": "139.150.121.48",
            //     "cpus": 38,
            //     "azure_sizes": "Ericaceae",
            //     "azure_location": "Zambia",
            //     "environment": "ZM",
            //     "parent_deployment": "04a1e33d-a25c-4d86-b03e-e0807aa6f5a7",
            //     "ram": 123
            //   }, {
            //     "id": "61a46544-7170-4efa-939b-736aacc32b3d",
            //     "name": "omniture.com",
            //     "os": "Rapley",
            //     "ip": "224.235.19.195",
            //     "cpus": 42,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "China",
            //     "environment": "CN",
            //     "parent_deployment": "ae482bce-aea4-4bfd-8240-da7bc2f88d9e",
            //     "ram": 33
            //   }, {
            //     "id": "ddd6f7b6-f003-44db-800c-4c195b46e3e2",
            //     "name": "toplist.cz",
            //     "os": "Ropking",
            //     "ip": "234.102.19.67",
            //     "cpus": 70,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Venezuela",
            //     "environment": "VE",
            //     "parent_deployment": "20823b3c-57e0-4faf-bc40-995bb3658d37",
            //     "ram": 120
            //   }, {
            //     "id": "58e08157-07bd-448d-a966-80c04e4c06c5",
            //     "name": "histats.com",
            //     "os": "Davern",
            //     "ip": "157.31.113.187",
            //     "cpus": 10,
            //     "azure_sizes": "Poaceae",
            //     "azure_location": "Luxembourg",
            //     "environment": "LU",
            //     "parent_deployment": "f3ad1055-702d-488e-942f-93c765b5cb63",
            //     "ram": 123
            //   }, {
            //     "id": "f0df9494-00e8-4433-945a-ec364ac59c36",
            //     "name": "telegraph.co.uk",
            //     "os": "Desantis",
            //     "ip": "18.101.104.253",
            //     "cpus": 117,
            //     "azure_sizes": "Geraniaceae",
            //     "azure_location": "Argentina",
            //     "environment": "AR",
            //     "parent_deployment": "49ee6a65-49b5-4ff2-941b-9a04b721b36c",
            //     "ram": 35
            //   }, {
            //     "id": "c9c91012-a8c3-4cd2-a20f-1935d9e05941",
            //     "name": "noaa.gov",
            //     "os": "Clericoates",
            //     "ip": "129.58.158.242",
            //     "cpus": 29,
            //     "azure_sizes": "Malvaceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "aba1e3b0-cb3a-4967-874c-885e4055e65d",
            //     "ram": 7
            //   }, {
            //     "id": "4de82443-4ce2-4804-95df-ec787ff0388e",
            //     "name": "yolasite.com",
            //     "os": "Lamperti",
            //     "ip": "122.151.10.226",
            //     "cpus": 58,
            //     "azure_sizes": "Physciaceae",
            //     "azure_location": "United States",
            //     "environment": "US",
            //     "parent_deployment": "baedc412-a08e-4c86-9187-cb559fefc980",
            //     "ram": 107
            //   }, {
            //     "id": "d7d8eb16-739f-4e99-9255-c2426ce55c30",
            //     "name": "ox.ac.uk",
            //     "os": "Ilyinykh",
            //     "ip": "171.51.82.15",
            //     "cpus": 103,
            //     "azure_sizes": "Liliaceae",
            //     "azure_location": "Portugal",
            //     "environment": "PT",
            //     "parent_deployment": "921d6419-2ab8-466b-b2e8-bab0b382fedb",
            //     "ram": 74
            //   }, {
            //     "id": "360292cf-bf45-4ab1-8297-65e03b7e9adf",
            //     "name": "theglobeandmail.com",
            //     "os": "Escott",
            //     "ip": "128.225.114.64",
            //     "cpus": 53,
            //     "azure_sizes": "Polemoniaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "64056c4f-7c81-4ab6-baa9-c0dd0b63fc5d",
            //     "ram": 5
            //   }, {
            //     "id": "87aa7cf1-e93e-41f1-92fb-203b4c3f81b5",
            //     "name": "sciencedirect.com",
            //     "os": "Absolom",
            //     "ip": "46.152.144.100",
            //     "cpus": 19,
            //     "azure_sizes": "Rubiaceae",
            //     "azure_location": "Thailand",
            //     "environment": "TH",
            //     "parent_deployment": "1f0edbff-fb67-4daf-939b-bea6036d3535",
            //     "ram": 10
            //   }, {
            //     "id": "e82ae8a2-b848-49c7-9389-744bd1ca302c",
            //     "name": "issuu.com",
            //     "os": "Cathersides",
            //     "ip": "29.121.115.193",
            //     "cpus": 11,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "Russia",
            //     "environment": "RU",
            //     "parent_deployment": "12c28f54-ee86-4ca9-a713-fd16af59bc1b",
            //     "ram": 124
            //   }, {
            //     "id": "827b265e-d19e-4563-b79c-d821653df269",
            //     "name": "tripadvisor.com",
            //     "os": "Mahomet",
            //     "ip": "248.159.164.83",
            //     "cpus": 51,
            //     "azure_sizes": "Funariaceae",
            //     "azure_location": "Indonesia",
            //     "environment": "ID",
            //     "parent_deployment": "d30920f4-f041-436a-b021-95b067a47184",
            //     "ram": 39
            //   }, {
            //     "id": "699a4e50-5dc9-4730-8df2-157481ab2cc2",
            //     "name": "elpais.com",
            //     "os": "Winn",
            //     "ip": "117.20.127.18",
            //     "cpus": 20,
            //     "azure_sizes": "Cyperaceae",
            //     "azure_location": "Colombia",
            //     "environment": "CO",
            //     "parent_deployment": "0d3baba8-ce01-47af-8fa8-490a0efebe7f",
            //     "ram": 9
            //   }, {
            //     "id": "4627fa57-fb58-4efa-9d03-043b9f452b66",
            //     "name": "foxnews.com",
            //     "os": "Raistrick",
            //     "ip": "215.73.242.213",
            //     "cpus": 96,
            //     "azure_sizes": "Asteraceae",
            //     "azure_location": "United States",
            //     "environment": "US",
            //     "parent_deployment": "ba46c246-23b0-4593-be16-6aa226cf705f",
            //     "ram": 61
            //   }, {
            //     "id": "2894287e-5dd8-40cf-9735-538907123e39",
            //     "name": "ibm.com",
            //     "os": "Gonnet",
            //     "ip": "224.82.152.246",
            //     "cpus": 49,
            //     "azure_sizes": "Bryaceae",
            //     "azure_location": "Dominican Republic",
            //     "environment": "DO",
            //     "parent_deployment": "3a5677fc-13ed-4b32-b1f5-85b367680d18",
            //     "ram": 57
            //   }];
            // let fake_data= {items: _itemsData};
            // //console.log(fake_data);
            // //console.log(fake_data.items);

            // fake_data.items.forEach(element => {
            //     console.log(element);
            //     spireDeployments.push(element);
            // });


            //console.log(spireDeployments);

            return Promise.all(spireDeployments);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_detailsData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_detailsData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _id = params.id;

    //return this.toolbox.getManager().doGet(`/executions/${id}?_include=parameters`);
    //https://cloudify-uat.dhl.com/console/sp/executions?_size=2&_offset=0&deployment_id=xa124ls410033&workflow_id=create_deployment_environment&deployment_id=xa124ls201053
    
    let _includesReqestString = "/executions?_size=1&deployment_id="+_id;

    return helper.Manager.doGet(_includesReqestString, {
        ...commonManagerRequestOptions
    })
        .then(data => {
            console.log('get_vm_detailsData results:');
            //console.log(data);
            return Promise.all(data.items);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_dataDiskData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_dataDiskData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let spireDeployments = [];

    if (_filteredDeploymentParentId!=undefined) 
    {
        console.log("spireDeployments search:");
        _searchParam = _filteredDeploymentParentId;
    }
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,labels,blueprint_id,tenant_name,environment_type,workflows',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {
            console.log('get_vm_dataDiskData results:');
            console.log("data:");
            console.log(data);

            //mock data:

            let fake_data= {diskData: []};
            fake_data.diskData.push({id:params.id, name:"C", disk_type:"SSD", disk_size:"1024",host_caching:"ReadOnly"});
            fake_data.diskData.push({id:params.id, name:"D", disk_type:"SSD", disk_size:"512",host_caching:"ReadOnly"});
            fake_data.diskData.push({id:params.id, name:"E", disk_type:"SSD", disk_size:"2048",host_caching:"None"});
            fake_data.diskData.push({id:params.id, name:"F", disk_type:"SSD", disk_size:"1024",host_caching:"None"});

            console.log(fake_data);
            console.log(fake_data.diskData);

            fake_data.diskData.forEach(element => {
                console.log(element);
                spireDeployments.push(element);
            });

            //console.log(spireDeployments);
            return Promise.all(spireDeployments);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});

r.register('get_vm_requestsData', 'GET', (req, res, next, helper) => {
    const _ = require('lodash');
    console.log('get_vm_requestsData...');
    const { headers } = req;
    const commonManagerRequestOptions = {
        headers: {
            tenant: headers.tenant,
            cookie: headers.cookie
        }
    };
    // parsing parametres:
    const params = { ...req.query };
    //console.log(params);
    let _searchParam = params._search;
    let _filteredDeploymentParentId = params.filteredDeploymentParentId;

    let spireDeployments = [];

    if (_filteredDeploymentParentId!=undefined) 
    {
        //console.log("spireDeployments search:");
        _searchParam = _filteredDeploymentParentId;
    }
    return helper.Manager.doGet('/deployments', {
        params: {
            _include: 'id,labels,blueprint_id,tenant_name,environment_type,workflows',
            _search:_searchParam
        },
        ...commonManagerRequestOptions
    })
        .then(data => {
            //console.log('get_vm_requestsData results:');
            //console.log("data:");
            //console.log(data);

            // Grant waiting for approval
            // Revocation waiting for approval
            // Grant approved
            // Revocation approved
            // Grant implemented

            //mock data:

            let fake_data= {requestsData: []};

            fake_data.requestsData.push({id:params.id, account_name:"vik1@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik2@dhl.com", role:"user", status:"Grant implemented",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik3@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik4@dhl.com", role:"admin", status:"Revocation approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik5@dhl.com", role:"admin", status:"Grant approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik6@dhl.com", role:"admin", status:"Grant waiting for approval",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik7@dhl.com", role:"user", status:"Grant approved",requestor:"vik1@dhl.com"});
            fake_data.requestsData.push({id:params.id, account_name:"vik8@dhl.com", role:"admin", status:"GGrant implemented",requestor:"vik1@dhl.com"});

            //console.log(fake_data);
            //console.log(fake_data.requestsData);

            fake_data.requestsData.forEach(element => {
                console.log(element);
                spireDeployments.push(element);
            });

            //console.log(spireDeployments);
            return Promise.all(spireDeployments);
        })
        .then(data => res.send(data))
        .catch(error => next(error));
});


}