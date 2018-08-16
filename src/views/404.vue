<template>
    <div id="page-not-found">
        <i class="fas fa-bullhorn"></i>
        <span>Page Not Found</span> 
    </div>
</template>

<style scoped>
    #page-not-found {
        margin: 10px;
        display: flex;
        justify-content: center;
    }

    i {
        color: #2d3e50;
        font-size: 175px;
        padding-top: 100px;
        transform: rotate(-20deg);
    }

    span {
        font-size: 50px;
        font-weight: bold;
        padding-top: 110px;
        padding-left: 50px;
    }

    @media (max-width: 655px) {
        i {
            font-size: 70px;
        }

        span {
            font-size: 22px;
            padding-top: 100px;
            padding-left: 25px;
        }
    }
</style>